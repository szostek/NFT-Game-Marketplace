import { withRouter } from 'next/router'
import { Box, Heading, Image, Center } from "@chakra-ui/react"


function itemPagePlay({ router: { query } }) {
    const nft = JSON.parse(query.nftInfo)
    console.log(nft)
    return (
        <Center>
            <Box w="65%">
                <Heading>{nft.name}</Heading>
                <Box boxSize="500">
                    <Image src={nft.image} alt="nft image" />
                </Box>
                <p>created by: {nft.sellerName}</p>
            </Box>
        </Center>
    )
}

export default withRouter(itemPagePlay)