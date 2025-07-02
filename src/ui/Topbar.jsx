function Topbar({title}) {
    return (
        <header className="topbar">
            <h3>{title || 'Welcome Back!'}</h3>
        </header>
    );
}

export default Topbar;