import React, { useState } from 'react';

function Settings() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile Updated!');
  };

  return (
    <section className="settings-form">
      <h4>User Settings</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </section>
  );
}

export default Settings;