import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import twitterLogo from './assets/twitter-logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import idl from './idl.json'

const { SystemProgram, Keypair } = web3;

let baseAccount = Keypair.generate();

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = { preflightCommitment: "processed" }

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  'https://media.giphy.com/media/6ygR0m66f6GvRnOS4D/giphy.gif',
  'https://media.giphy.com/media/S2wuT4Ta9ksKTeLYrk/giphy.gif',
  'https://media.giphy.com/media/hEaxF5qJU6yYgMEfxu/giphy.gif',
  'https://media.giphy.com/media/MFmRXq9kFIBimLJS2h/giphy.gif'
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifLink, setGifLink] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.solana) {
        if (window.solana.isPhantom) {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          console.log('Wallet connected with public key: ', response.publicKey.toString())
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Please install Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    if (window.solana) {
      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  }

  const sendGif = async e => {
    e.preventDefault()
    if (gifLink.length > 0) {
      console.log('Gif link:', gifLink);
      setGifList([...gifList, gifLink]);
      setGifLink('')
    } else {
      alert('Empty input. Try again.');
    }
  }

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account)
      setGifList(account.gifList)

    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getGifList();

    } catch (error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Oeeeee 🖼GIF Portal</p>
          <p className="sub-text">
            View your Muay Thai GIF collection in the metaverse ✨
          </p>
          {!walletAddress && (
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
          )}
          {walletAddress && gifList === null ? (
            <div className="connected-container">
              <button className="cta-button submit-gif-button" onClick={createGifAccount}>
                Do One-Time Initialization For GIF Program Account
              </button>
            </div>
          ) : (
            <div className="connected-container">
              <form onSubmit={sendGif}>
                <input
                  value={gifLink}
                  onChange={e => setGifLink(e.target.value)}
                  type="text"
                  placeholder="Enter gif link!"
                />
                <button type="submit" className="cta-button submit-gif-button">Submit</button>
              </form>
              <div className="gif-grid">
                {gifList.map((gif, i) => (
                  <div className="gif-item" key={i}>
                    <img src={getGifList.gifLink} alt={gif} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
