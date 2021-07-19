import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCourses } from '../action/auth'

export default function Courses(props) {
  const router = useRouter()

  const [login, setLogin] = useState('')
  const [coursesList, setCoursesList] = useState([])
  const [currentCourse, setCurrentCourse] = useState({})
  const [currentIdx, setCurrentIdx] = useState(0)


  useEffect(() => {
    const user = localStorage.getItem("user")
    !user && setCoursesList(props?.data)
    if (user) {
      const userData = JSON.parse(user)
      setLogin(userData)
      setCoursesList(props?.data?.filter(co => userData?.courses?.includes(co?.id)))
    }
  }, [])


  const onCourseClick = (item) => {
    setCurrentCourse(item)
    setCurrentIdx(0)
  }

  return (
    <div className="home">
      <Head>
        <title>SimpliLearn - Courses</title>
      </Head>
      <nav>
        <h1>SimpliLearn</h1>
        <div className="header">
          <Link href="/">
            Home
          </Link>
          <Link href="/login">
            {login ? 'Log Out' : 'Login'}
          </Link>
        </div>
      </nav>
      {currentCourse?.videoLink && <div className="video">
        <iframe src={currentCourse?.videoLink[currentIdx]}>
        </iframe>
        <div>

          <button onClick={() => setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}>Previous</button>
          <button onClick={() => setCurrentIdx(currentIdx + 1)} disabled={currentIdx < currentCourse?.videoLink?.length - 1}>Next</button>
        </div>
      </div>}
      <div className="landing">
        {coursesList?.map(item =>
          <div className="card" key={item.id} onClick={() => onCourseClick(item)}>
            <img src={item.thumbnailURL} alt={item.title} />
            <h2>{item.title}</h2>
          </div>
        )}
      </div>
    </div>
  )
}

Courses.getInitialProps = async (ctx) => {
  const res = await getCourses()
  return { data: res?.data }
}

