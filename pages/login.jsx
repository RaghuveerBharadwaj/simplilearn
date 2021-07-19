import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { login } from '../action/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    localStorage.clear()
  }, [])

  const submitLogin = async (body) => {
    try {
      const res = await login(body)
      if(res?.data?.token) {
        localStorage.setItem("user", JSON.stringify(res?.data))
        router.push("/")
      }
    } catch (err) {
      console.log(err?.response?.data)
      setLoginError(err?.response?.data)
    }
  }
  
  return (
    <div className="login-container">
    <Head>
      <title>SimpliLearn - Login</title>
    </Head>
      <img className="blur-img" src="login.svg" alt="Simplilearn" />
      <div className="login">
        <img src="login.svg" alt="Simplilearn" />
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={values => {
            let errors = {}
            if (!(values.username &&
              (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.username)))) {
              errors.username = 'Please enter valid email'
            } if (!values.password) {
              errors.password = 'Please enter password'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values)
            submitLogin(values)
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
              <h1>Welcome!!! <br />
                Login to your account now.</h1>
              <br />
              <br />
              <input
                name='username'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                placeholder='Email'
                className={errors.username && touched.username ? "error" : ""}
              />
              <span className='err'>
                {errors.username && touched.username ? errors.username : ""}
              </span>
              <input
                type='password'
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder='Password'
                className={errors.password && touched.password ? "error" : ""}
              />
              <span className='err'>
                {errors.password && touched.password ? errors.password : ""}
              </span>
              <span className='err'>
                {loginError}
              </span>
              <button
                type='submit'
                disabled={isSubmitting}
              >
                LOG IN
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}
