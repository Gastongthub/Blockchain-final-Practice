import { useState } from 'react';
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

function ComplaintForm({ contract, account }) {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ipfsHash = await ipfs.add(file);
    await contract.mintComplaint(
      account,
      location,
      description,
      ipfsHash.path
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Submit Complaint</button>
    </form>
  );
}