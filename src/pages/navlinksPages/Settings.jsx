import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Profile
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    budgetAlerts: true,
    transactionAlerts: true,
    
    // Preferences
    theme: 'light',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY'
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content">
            <h3 className="tab-title">Profile Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input with-icon"
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="tab-content">
            <h3 className="tab-title">Security Settings</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-with-icon">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="form-input with-icon"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group full-width">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="twoFactorEnabled"
                    name="twoFactorEnabled"
                    checked={formData.twoFactorEnabled}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="twoFactorEnabled" className="checkbox-label">
                    Enable Two-Factor Authentication
                    <span className="checkbox-description">Add an extra layer of security to your account</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="tab-content">
            <h3 className="tab-title">Notification Preferences</h3>
            <div className="notification-groups">
              <div className="notification-group">
                <h4>General Notifications</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="emailNotifications" className="checkbox-label">
                    Email Notifications
                    <span className="checkbox-description">Receive updates via email</span>
                  </label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="pushNotifications" className="checkbox-label">
                    Push Notifications
                    <span className="checkbox-description">Receive browser notifications</span>
                  </label>
                </div>
              </div>
              
              <div className="notification-group">
                <h4>Financial Alerts</h4>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="budgetAlerts"
                    name="budgetAlerts"
                    checked={formData.budgetAlerts}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="budgetAlerts" className="checkbox-label">
                    Budget Alerts
                    <span className="checkbox-description">Get notified when approaching budget limits</span>
                  </label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="transactionAlerts"
                    name="transactionAlerts"
                    checked={formData.transactionAlerts}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="transactionAlerts" className="checkbox-label">
                    Transaction Alerts
                    <span className="checkbox-description">Receive alerts for new transactions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="tab-content">
            <h3 className="tab-title">App Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <div className="input-with-icon">
                  <Globe size={20} className="input-icon" />
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="form-select with-icon"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="dateFormat">Date Format</label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="settings-section">
      <div className="section-header">
        <h2 className="section-title">Settings</h2>
        <p className="section-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit} className="settings-form">
            {renderTabContent()}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className={`save-btn ${saveStatus}`}
                disabled={saveStatus === 'saving'}
              >
                <Save size={20} />
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Settings;