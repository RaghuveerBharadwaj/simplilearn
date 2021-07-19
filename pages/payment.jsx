import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { payment } from '../action/auth'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const Payment = () => {
  const router = useRouter()

  const [course, setCourse] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')

  useEffect(() => {
    const loginDetails = localStorage.getItem("user")
    if (!loginDetails) {
      router.push("/login")
    }
    const courseDetails = localStorage.getItem("course")
    if (courseDetails) {
      setCourse(JSON.parse(courseDetails))
    } else {
      router.push("/")
    }
  }, [])

  const onOTPSubmit = async () => {
    if (otp != 123456) {
      return setOtpError("Invalid OTP")
    }
    const userData = JSON.parse(localStorage.getItem("user"))
    const res = await payment({
      token: userData?.token,
      username: userData?.username,
      courses: [...userData.courses, course?.id ]
    }, {
      headers: {
        token: userData?.token,
      }
    })
    if (res?.data) {
      localStorage.setItem("user", JSON.stringify(res?.data))
      localStorage.removeItem("course")
      setIsModalOpen(false)
      router.push('/courses')
    }
  }

  return (
    <div className="login-container">
      <Head>
        <title>SimpliLearn - Payment</title>
      </Head>
      {isModalOpen && <div className="modal">
        <div className="otp">
          <label htmlFor="otp">Enter OTP</label>
          <p>Please enter 6 digits OTP sent to your phone number.</p><br />
          <input name="otp" placeholder="000000" type="number" value={otp} onChange={e => setOtp(e.target.value)} /><br />
          <span className='err'>
            {otpError}
          </span>
          <p>
            Chose the wrong product?
            <Link href="/"> Go Home </Link>
          </p><br />
          <button onClick={onOTPSubmit}>
            Submit
          </button>
        </div>
      </div>}
      <img className="blur-img" src="login.svg" alt="Simplilearn" />
      <div className="login">
        <img src="login.svg" alt="Simplilearn" />
        <Formik
          initialValues={{ name: '', cardNumber: '', expiryDate: '', cvv: '' }}
          validate={values => {
            let errors = {}
            if (!values.name) {
              errors.name = 'Please enter valid name'
            } if (!(values.cardNumber && /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(values.cardNumber))) {
              errors.cardNumber = 'Please enter valid Card Number'
            } if (!(values.expiryDate && /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(values.expiryDate))) {
              errors.expiryDate = 'Please enter valid expiry date. eg: (12/24)'
            } if (!(values.cvv && /^[0-9]{3}$/.test(values.cvv))) {
              errors.cvv = 'Please enter valid 3 digit CVV code. eg: (123)'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values)
            setIsModalOpen(true)
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form className="login-form" onSubmit={handleSubmit}>
              <h1>{course?.title} &nbsp; - &nbsp; ${course?.price}</h1>
              <br />
              <br />
              <input
                name='name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                placeholder='Name on Card'
                className={errors.name && touched.name ? "error" : ""}
              />
              <span className='err'>
                {errors.name && touched.name ? errors.name : ""}
              </span>
              <input
                type='cardNumber'
                name='cardNumber'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.cardNumber}
                placeholder='Card Number'
                className={errors.cardNumber && touched.cardNumber ? "error" : ""}
              />
              <span className='err'>
                {errors.cardNumber && touched.cardNumber ? errors.cardNumber : ""}
              </span>

              <input
                type='expiryDate'
                name='expiryDate'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.expiryDate}
                placeholder='Expiry Date'
                className={errors.expiryDate && touched.expiryDate ? "error" : ""}
              />
              <span className='err'>
                {errors.expiryDate && touched.expiryDate ? errors.expiryDate : ""}
              </span>

              <input
                type='cvv'
                name='cvv'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.cvv}
                placeholder='Secret Code (CVV)'
                className={errors.cvv && touched.cvv ? "error" : ""}
              />
              <span className='err'>
                {errors.cvv && touched.cvv ? errors.cvv : ""}
              </span>
              <p>
                Chose the wrong product?
                <Link href="/"> Go Home </Link>
              </p>
              <button
                type='submit'
                disabled={isSubmitting}
              >
                Procced to Pay
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Payment
