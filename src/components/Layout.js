/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

 import React from "react"
 import { useStaticQuery, graphql } from "gatsby"
 import Header from "./Header"
 import Footer from '../components/Footer'
 
 import 'bootstrap/dist/css/bootstrap.css';
 import "./layout.css"
 
 const Layout = ({ children }) => {
   const data = useStaticQuery(graphql`
     query SiteTitleQuery {
       site {
         siteMetadata {
           title
         }
       }
     }
   `)
 
   return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main>{children}</main>
      <Footer></Footer>
    </>
   )
 }
 
 Layout.propTypes = {
   // children: PropTypes.node.isRequired,
 }
 
 export default Layout
 