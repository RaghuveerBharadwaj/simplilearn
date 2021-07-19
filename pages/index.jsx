import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCourses } from '../action/auth'

export default function Home(props) {
  const router = useRouter()

  const [login, setLogin] = useState('')
  const [coursesList, setCoursesList] = useState([])

  useEffect(() => {
    const user = localStorage.getItem("user")
    !user && setCoursesList(props?.data)
    if (user) {
      const userData = JSON.parse(user)
      setLogin(userData)
      setCoursesList(props?.data?.filter(co => !userData?.courses?.includes(co?.id)))
    }
  }, [])

  const onBuy = (item) => {
    if (!login) {
      router.push("/login")
    }
    localStorage.setItem("course", JSON.stringify(item))
    router.push("/payment")
  }

  return (
    <div className="home">
      <Head>
        <title>SimpliLearn - Home</title>
      </Head>
      <nav>
        <h1>SimpliLearn</h1>
        <div className="header">
          {login?.courses?.length > 0 && <Link href="/courses">
            Courses
          </Link>}
          <Link href="/login">
            {login ? 'Log Out' : 'Login'}
          </Link>
        </div>
      </nav>
      <div className="landing">
        {coursesList?.map(item =>
          <div className="card" key={item.id}>
            <img src={item.thumbnailURL} alt={item.title} />
            <h2>{item.title}</h2>
            <p className="price" >${item.price}</p>
            <button onClick={() => onBuy(item)}>Buy Now</button>
          </div>
        )}
      </div>
    </div>
  )
}

Home.getInitialProps = async (ctx) => {
  const res = await getCourses()
  return { data: res?.data }
}
