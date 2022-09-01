import Head from "next/head"
import styles from "../styles/Home.module.css"
import { LW3PUNKS_ADDRESS, LW3PUNKS_ABI } from "../constants"
import { useState, useRef, useEffect } from "react"
import Web3Modal from "web3modal"
import { Contract, utils, providers } from "ethers"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0")
  const [loading, setLoading] = useState(false)
  const web3ModalRef = useRef()

  const getProviderOrSigner = async (needSigner) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    if(chainId !== 80001) {
      window.alert("Please connect to mumbai!")
      throw new Error("Please connect to mumbai!")
    }

    if(needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }

    return web3Provider
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) {
      console.error(error)
    }
  }

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const LW3PunksContract = new Contract(
        LW3PUNKS_ADDRESS,
        LW3PUNKS_ABI,
        provider
      )

      const _tokenIdsMinted = await LW3PunksContract.tokenIds()
      setTokenIdsMinted(_tokenIdsMinted.toString())
    } catch (error) {
      console.error(error)
    }
  }

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true) 

      const LW3PunksContract = new Contract(
        LW3PUNKS_ADDRESS,
        LW3PUNKS_ABI,
        signer
      )

      const tx = await LW3PunksContract._mint({
        value: utils.parseEther("0.01")
      })

      setLoading(true)
      await tx.wait()
      window.alert("You have successfully minted 1 LW3Punks!")
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })
      
      connectWallet()
      getTokenIdsMinted()

      setInterval(async () => {
        await getTokenIdsMinted()
      }, 5 * 1000)
    }
  }, [walletConnected])

  function renderButton() {
    if(!walletConnected) {
      return(
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      )
    }

    if(loading) {
      return(
        <div className={styles.description}>
          Loading..., please wait!
        </div>
      )
    }

    return(
      <button className={styles.button} onClick={publicMint}>
        MINT
      </button>
    )
  }

  return(
    <div>
      <Head>
        <title>LW3Punks NFT</title>
        <meta name="description" content="LW3Punks dApp"/>
        <link rel="icon" href="./favicon.ico"/>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            LW3Punks is an NFT for LearnWeb3 students
            <br/>
            Join Us Today!
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 LW3Punks have been minted!
          </div>
          {renderButton()}
        </div>
        <div>
          <img src="./learnweb3punks.png" className={styles.image} />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; for LearnWeb3 Learners!
      </footer>

    </div>
  )
}