import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import './App.css';
import OpenAR from './utils/OpenAR.json'

// const OpenARAddress = "0xb43F4A509B296150E63eEe50a96bd96cD7CdD084" //localhost:8545

const OpenARAddress = "0x89645A7a00Efdf00F0304122F46243Ce20df7395" // Ropsten

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()
  const [tokenURI, setTokenURI] = useState()
  const [addr1, setAddr1] = useState()
  const [addr2, setAddr2] = useState()
  const [userBalance, setOwnerBalance] = useState()
  const [ownerOfNFT, setOwnerOfNFT] = useState()
  const [newOwner, setNewOwner] = useState()
  const [newTokenURI, setNewTokenURI] = useState()
  const [receiver, setReceiver] = useState()
  // const [NFTInfo, setNFTInfo] = useState()
  // const [tokenId, setTokenId] = useState()
  // const [viewTokenId, setViewTokenId] = useState()
  // const [value, setValue] = useState()
  // const [newNftOwner, setNewNftOwner] = useState()
  // const [anotherNftOwner, setAnotherNewNftOwner] = useState()

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  // OpenAR contract starts

  async function getNFTBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, provider)
      const balance = await contract.balanceOf(account);
      setOwnerBalance(balance.toString());
    }
  }

  async function mintArNFT() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, signer);
      const transaction = await contract.mint(tokenURI, amount, userAccount);
      await transaction.wait();
      setNewOwner(userAccount);
    }
  }

  // async function purchaseNFT() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, signer);
  //     const transaction = await contract.purchaseNft(tokenId, {from: anotherNftOwner, value});
  //     await transaction.wait();
  //     setViewTokenId(tokenId);
  //     setNewNftOwner(anotherNftOwner);
  //   }
  // }

  async function transferNFT() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, signer);
      const transaction = await contract["safeTransferFrom(address,address,uint256)"](addr1, addr2, 1);
      await transaction.wait();
      setNewTokenURI(tokenURI); 
      setReceiver(addr2);
    }
  }

  async function NFTOwner() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, signer);
      const owner = await contract["ownerOf(uint256)"](tokenURI);
      setOwnerOfNFT(owner);
    }
  }

  // async function getNftInfo() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(OpenARAddress, OpenAR.abi, signer);
  //     const nftInfo = await contract.purchasedNfts(tokenURI);
  //     setNFTInfo(`${nftInfo}`)
  //   }
  // }

// Open AR contract ends 

useEffect(() => {
  checkIfWalletIsConnected();
}, [])


  return (
    <div className="App">
      <header className="App-header">

        {!currentAccount && (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
        <p>Connected to MetaMask on account: {currentAccount}</p>
        <br />

        <button onClick={getNFTBalance}>Get NFT Balance</button>
          <div>NFT Balance: {userBalance}</div>

        <br />
        <button onClick={mintArNFT}>Mint NFT</button>
        <input onChange={e => setTokenURI(e.target.value)} placeholder="Token URI" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Sale Price $USD" />
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Owner" />
        <div>NFT successfully minted by: {newOwner}</div>

        {/* <br />
        <button onClick={purchaseNFT}>Purchase NFT</button>
        <input onChange={e => setTokenId(e.target.value)} placeholder="Token Id" />
        <input onChange={e => setValue(e.target.value)} placeholder="Purchase Price $USD" />
        <input onChange={e => setAnotherNewNftOwner(e.target.value)} placeholder="Owner" />
        <div>NFT with Token ID of {viewTokenId} successfully purchased by: {newNftOwner}</div> */}

        <br />
        <button onClick={transferNFT}>Send NFT</button>
        <input onChange={e => setAddr1(e.target.value)} placeholder="From Account" />
        <input onChange={e => setAddr2(e.target.value)} placeholder="To Account" />
        <input onChange={e => setTokenURI(e.target.value)} placeholder="TokenId" />
        <div>NFT with TokenID {newTokenURI} successfully sent to: {receiver}</div>

        <br />
        <button onClick={NFTOwner}>NFT Owner</button>
        <input onChange={e => setTokenURI(e.target.value)} placeholder="TokenID" />
        <div>NFT owner is: {ownerOfNFT}</div>  

        {/* <br />
        <button onClick={getNftInfo}>NFT Details</button>
        <input onChange={e => setNFTInfo(e.target.value)} placeholder="TokenID" />
        <div>{NFTInfo}</div> */}
      </header>
    </div>
  );
}

export default App;
