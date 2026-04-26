import { NavLink } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Nav() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>Active Loom</NavLink>
        <NavLink to="/past-bank">Past Bank</NavLink>
        <NavLink to="/holder">Holder Rituals</NavLink>
        <NavLink to="/owner">Owner</NavLink>
      </nav>

      <div className="connect-bar">
        <div className="status">
          <span className="dot live"></span>
          Base Mainnet · Chain 8453
        </div>
        <ConnectButton chainStatus="none" showBalance={false} />
      </div>
    </>
  )
}
