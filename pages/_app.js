import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { ChakraProvider , extendTheme } from "@chakra-ui/react"
import NavBar from '../components/navbar/navbar'

const serverUrl = "https://mlnerjjrm3a6.usemoralis.com:2053/server"
const appId = "07LAtr3qBfXDzDtAFEcJlyUmCnBV9BUQVBwxUSeT"

const theme = extendTheme({
  config: {
    initialColorMode: 'light'
  }
})

function Marketplace({ Component, pageProps }) {
  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <ChakraProvider  theme={theme}>
        <NavBar/>
        <Component {...pageProps} />
      </ChakraProvider >
    </MoralisProvider>
  )
}

export default Marketplace