import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import { Box, Image } from '@chakra-ui/react'
import { useMoralisCloudFunction } from 'react-moralis'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [sellerParams, setSellerParams] = useState({})
  const [ownerParams, setOwnerParams] = useState({})
  // const [params, setParams] = useState({})

  useEffect(() => {
    loadNFTs()
  }, [])

  //call cloud function to get user info:
  const { fetch } = useMoralisCloudFunction("getUserInfo", sellerParams, { autoFetch: false});

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const itemData = await marketContract.fetchMarketItems()

    const items = await Promise.all(itemData.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)

      
      // let sellerName = 'N/A'
      
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }

      setSellerParams(sellerParams.ethAddress = item.seller.toLowerCase())

      if (!item.owner.includes('00000')) {
        setOwnerParams(ownerParams.ethAddress = item.owner.toLowerCase())
      }
    
      const getSeller = () => {
        fetch({
          onError: (err) => console.log(err),
          onSuccess: (data) => {
            item.sellerName = data[0].attributes.username
            item.sellerAvatar = data[0].attributes.profilePic._url
            setSellerParams({})
          } 
        })
      }
      getSeller()

      return item
    }))
    
    setNfts(items)
    setLoadingState('loaded') 
  }
  // async function buyNft(nft) {
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()
  //   const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

  //   const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  //   const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
  //     value: price
  //   })
  //   await transaction.wait()
  //   loadNFTs()
  // }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <Link href={{ pathname: "/itemPagePlay", query: { nftInfo: JSON.stringify(nft) } }}key={i}>
                <div  className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} className="cursor-pointer" />
                  <div className="p-4">
                    <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                    <div style={{ height: '70px', overflow: 'hidden' }}>
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                    <div>
                        <p>Created by: {nft.sellerName}</p>
                        <Image
                              borderRadius="full"
                              boxSize="50px"
                              src={nft.sellerAvatar}
                              alt="Profile Pic"
                        />
                    </div>
                    <div>
                        <p>Owned by: {nft.ownerName ? nft.ownerName : '-'}</p>
                        { !nft.owner.includes('00000') 
                        ?
                        <Image
                              borderRadius="full"
                              boxSize="50px"
                              src={nft.ownerAvatar}
                              alt="Profile Pic"
                        />
                        : <></>}
                    </div>
                  </div>
                  {/* <div className="p-4 bg-black">
                    <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                  </div> */}
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}