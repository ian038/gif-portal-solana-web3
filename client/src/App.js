import twitterLogo from './assets/twitter-logo.svg';
import { useEffect, useState } from 'react';
import './App.css';

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

      // Call Solana program here.
      setGifList(TEST_GIFS);
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
          {walletAddress && (
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
                {gifList.map(gif => (
                  <div className="gif-item" key={gif}>
                    <img src={gif} alt={gif} />
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
