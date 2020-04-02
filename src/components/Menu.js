import React from "react"
import { Link } from "gatsby"

const Pages = [
  { name: "Home", link: "/" },
  { name: "Survey", link: "/survey" },
]

export default function Menu() {
  return (
    <ul>
      {Pages.map(page => (
        <li>
          <Link to={page.link}>{page.name}</Link>
        </li>
      ))}
    </ul>
  )
}
