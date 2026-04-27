import React from 'react'
import BlogDetailsHero from '../components/blog/BlogDetailsHero'
import BlogDetailsCardTypo from '../components/blog/BlogDetailsCardTypo'
import LatestBlogHeader from '../components/blog/BlogDetailsLatestPost'

const Blog_Details = () => {
  return (
    <div>
      <BlogDetailsHero />
      <BlogDetailsCardTypo />
      <LatestBlogHeader />
    </div>
  )
}

export default Blog_Details
