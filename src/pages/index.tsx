import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useFTAP } from '../hooks/useFTAP';

const Home: NextPage = () => {
  const FTAP = useFTAP()

  return (
    <div>
      <Head>
        <title>NSFD</title>
      </Head>

      <main>
        NSFD TEST APP
      </main>
    </div>
  )
}

export default Home
