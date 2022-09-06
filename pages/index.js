import Head from 'next/head'
import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"

import styles from '../styles/Home.module.css'

export default function Home() {
  const { data: session } = useSession()
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      { !session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {


  // const requestOptions = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Basic ${process.env.HARPER_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     operation: 'add_user',
  //     role: 'standard_user',
  //     username: 'test',
  //     password: '1234',
  //     active: true,
  //   }),
  //   redirect: 'follow',
  // }

  // const response = await fetch('https://test1-colbyfayock.harperdbcloud.com', requestOptions);
  // const result = await response.json()

  // console.log('result', result)


  // const harperFetch = async (body) => {
  //   const request = await fetch('https://db-leerob.harperdbcloud.com', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Basic ${process.env.HARPERDB_KEY}`,
  //     },
  //     body: JSON.stringify(body),
  //   });

  //   return request.json();
  // };

  // const dogs = await harperFetch({
  //   operation: 'sql',
  //   sql: 'SELECT * FROM dev.dog',
  // });

  // const data = await harperFetch({
  //   operation: 'insert',
  //   schema: 'dev',
  //   table: 'dog',
  //   records: [
  //     {
  //       dog_name: 'Fifi',
  //       owner_name: 'Lee',
  //       breed_id: 154,
  //       age: 5,
  //       weight_lbs: 35,
  //       adorable: true,
  //     },
  //   ],
  // });

  return {
    props: {

    }
  }
}