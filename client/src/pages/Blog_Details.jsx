import React from 'react'
import BlogDetailsHero from '../components/ui/Blog_DetailsHero'
import BlogDetailsCardTypo from '../components/ui/Blog_DetailsCardTypo'
import LatestBlogHeader from '../components/ui/BlogDetailsLatestPost'

const Blog_Details = () => {
  return (
    <div>
      <BlogDetailsHero />
      <BlogDetailsCardTypo/>    
      <LatestBlogHeader/>
    </div>
  )
}

export default Blog_Details
