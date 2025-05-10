import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Layout from '../components/Layout';
import ComplaintNFT from '../artifacts/contracts/ComplaintNFT.sol/ComplaintNFT.json';

export default function Dashboard() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Make sure this matches your deployed contract
  const [complaints, setComplaints] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadComplaints() {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check and switch network if needed
        const network = await provider.getNetwork();
        if (network.chainId !== 31337n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x7A69' }],
            });
          } catch (error) {
            console.error("Network switch error:", error);
            return;
          }
        }

        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        
        const contract = new ethers.Contract(
          contractAddress,
          ComplaintNFT.abi,
          provider
        );

        // Get total supply first
        const count = await contract.totalSupply();
        console.log("Total complaints:", count.toString());

        const complaintsList = [];
        for (let i = 0; i < Number(count); i++) {
          const complaint = await contract.complaints(i);
          complaintsList.push({
            id: i,
            name: complaint.name,
            phone: complaint.phone,
            location: complaint.location,
            description: complaint.description,
            status: complaint.status,
            timestamp: new Date(Number(complaint.timestamp) * 1000).toLocaleString()
          });
        }
        
        setComplaints(complaintsList);
      } catch (err) {
        console.error("Error loading complaints:", err);
      }
    }

    loadComplaints();
    const interval = setInterval(loadComplaints, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Complaints List</h1>
        <p style={styles.accountInfo}>Connected Account: {account}</p>

        {complaints.length === 0 ? (
          <div style={styles.noComplaints}>
            <p>Your complaint is well submitted on blockchain!</p>
            <p style={styles.subText}>All submitted complaints will appear here.</p>
          </div>
        ) : (
          <div style={styles.complaintsList}>
            {complaints.map((complaint) => (
              <div key={complaint.id} style={styles.complaintItem}>
                <div style={styles.complaintHeader}>
                  <h3 style={styles.complaintTitle}>Complaint #{complaint.id + 1}</h3>
                  <div style={styles.statusBadge(Number(complaint.status))}>
                    {['Open', 'In Progress', 'Resolved'][Number(complaint.status)]}
                  </div>
                </div>
                <div style={styles.complaintDetails}>
                  <div style={styles.detailRow}>
                    <strong>Submitted by:</strong> {complaint.name}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Location:</strong> {complaint.location}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Description:</strong> {complaint.description}
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Contact:</strong> {complaint.phone}
                  </div>
                  <div style={styles.timestamp}>
                    Submitted on {complaint.timestamp}
                  </div>
                  <div style={styles.statusSection}>
                    <div style={styles.statusHeader}>Status Timeline:</div>
                    <div style={styles.statusSteps}>
                      <div style={styles.statusStep(0, complaint.status)}>
                        Open
                      </div>
                      <div style={styles.statusArrow}>→</div>
                      <div style={styles.statusStep(1, complaint.status)}>
                        In Progress
                      </div>
                      <div style={styles.statusArrow}>→</div>
                      <div style={styles.statusStep(2, complaint.status)}>
                        Resolved
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  accountInfo: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
  },
  complaintsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  complaintItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #eee',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  complaintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
  },
  complaintTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  statusBadge: (status) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: 'white',
    backgroundColor: 
      status === 0 ? '#ef5350' :
      status === 1 ? '#42a5f5' : '#66bb6a',
  }),
  complaintDetails: {
    padding: '20px',
  },
  detailRow: {
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  timestamp: {
    marginTop: '15px',
    color: '#666',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  noComplaints: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#666',
  },
  subText: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '10px',
  }
};