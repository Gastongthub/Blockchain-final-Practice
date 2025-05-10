import Layout from '../components/Layout';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import ComplaintNFT from '../artifacts/contracts/ComplaintNFT.sol/ComplaintNFT.json';

export default function Home() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('test-hash'); // Placeholder hash
  const router = useRouter();

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        router.push('/dashboard');
      } catch (err) {
        console.error("Error connecting to wallet:", err);
      }
    }
  }

  async function submitComplaint(e) {
    e.preventDefault();
    if (!contract) return;

    try {
      // First check if the account has admin role
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      const hasRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, account);
      
      if (!hasRole) {
        alert('Error: Your account does not have permission to submit complaints');
        return;
      }

      const tx = await contract.mintComplaint(
        account,
        location,
        description,
        ipfsHash
      );
      await tx.wait();
      alert('Complaint submitted successfully!');
      setLocation('');
      setDescription('');
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Error submitting complaint: ' + err.message);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Civic Voice DApp</h1>
      
      {!account ? (
                 <button onClick={connectWallet} style={{ padding: '10px 20px' }}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <form onSubmit={submitComplaint} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label>
                Location:
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', height: '100px' }}
                  required
                />
              </label>
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
              Submit Complaint
            </button>
          </form>
        </div>
      )}
    </div>
  );
}