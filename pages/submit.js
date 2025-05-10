import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ComplaintNFT from '../artifacts/contracts/ComplaintNFT.sol/ComplaintNFT.json';

export default function Submit() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState(null);
  const router = useRouter();

  // Fix the useEffect syntax
  useEffect(() => {
    connectWallet();
  }, []);

  // Update the connectWallet function
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        
        // Add network check
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        
        // Check if we're on the correct network (Hardhat's chainId is 31337)
        if (chainId !== 31337n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x7A69' }], // 31337 in hex
            });
          } catch (switchError) {
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x7A69',
                  chainName: 'Hardhat Local',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['http://127.0.0.1:8545'],
                }],
              });
            }
          }
        }
      } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
      }
    } else {
      alert("Please install MetaMask to use this application");
    }
  }

  // Add event listener for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
    connectWallet();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
      }
    };
  }, []);

  async function submitComplaint(e) {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    setIsSubmitting(true);
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Use the same address as dashboard
      
      const contract = new ethers.Contract(
        contractAddress,
        ComplaintNFT.abi,
        signer
      );
  
      const tx = await contract.createComplaint(
        name,
        phone,
        location,
        description
      );
  
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      alert('Complaint submitted successfully!');
      router.push('/dashboard'); // Redirect to dashboard after submission
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting complaint: ' + (err.message || err.reason));
    } finally {
      setIsSubmitting(false);
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Submit Complaint';
      }
    }
  }

  return (
    <Layout>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Welcome to Civic Voice DApp</h1>
        <p style={styles.welcomeText}>
          This platform allows citizens to submit and track civic complaints using blockchain technology. 
          Each complaint is stored as a unique NFT, ensuring transparency and immutability of your reports.
        </p>
      </div>
      <h2 style={styles.heading}>Submit New Complaint</h2>
      <form onSubmit={submitComplaint} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter your full name"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter your phone number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
            rows={6}
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            ...styles.button,
            backgroundColor: isSubmitting ? '#cccccc' : '#4CAF50',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </Layout>
  );
}

const styles = {
  heading: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'vertical',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  welcomeTitle: {
    color: '#2c3e50',
    marginBottom: '15px',
    fontSize: '2em',
  },
  welcomeText: {
    color: '#34495e',
    fontSize: '1.1em',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto',
  },
};