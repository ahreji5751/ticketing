import Link from 'next/link'

const Header = ({ currentUser }) => {
  const links = [
    { label: 'Sign Up', href: '/auth/signup', show: !currentUser },
    { label: 'Sign In', href: '/auth/signin', show: !currentUser },
    { label: 'Sign Out', href: '/auth/signout', show: currentUser },
  ].filter(({ show }) => show);

  return (
    <nav className="navbar navbar-light bg-light p-3">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>  
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {
            links.map(({ href, label }) => 
              <li key={href} className="nav-item">
                <Link href={href}>
                  <a className="nav-link">{label}</a>
                </Link>
              </li>
            )
          }
        </ul>
      </div>  
    </nav>
  )
}

export default Header;