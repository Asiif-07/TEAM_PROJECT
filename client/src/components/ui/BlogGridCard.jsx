import BlogCard from './BlogCard.jsx';
import img2 from '../../assets/blogsPics/img2.png';
import img3 from '../../assets/blogsPics/img3.png';
import img4 from '../../assets/blogsPics/img4.png';
import img5 from '../../assets/blogsPics/img5.png';
import img6 from '../../assets/blogsPics/img6.png';


const BlogGrid = () => {
  // Data exactly matching your screenshot
  const blogPosts = [
    {
      id: 1,
      image: img2,
      category: "LinkedIn",
      title: "How to Optimize Your LinkedIn Profile for Recruiters",
      description: "A step-by-step guide to creating a LinkedIn profile that attracts recruiters and opens doors to new opportunities.",
      authorName: "Sarah Jonson",
      authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      readTime: "5 min read"
    },
    {
      id: 2,
      image: img3,
      category: "Interview Tips",
      title: "Mastering the STAR Method for Interview Success",
      description: "Learn how to structure your interview answers using the STAR method to impress hiring managers and land your dream job.",
      authorName: "Sarah Jonson",
      authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      readTime: "5 min read"
    },
    {
      id: 3,
      image: img4,
      category: "CV Writing",
      title: "Remote Work CV: How to Stand Out in 2024",
      description: "Essential tips for crafting a CV that highlights your remote work skills and makes you attractive to distributed teams.",
      authorName: "Sarah Jonson",
      authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      readTime: "5 min read"
    },
    {
      id: 4,
      image: img5,
      category: "Career Advice",
      title: "Career Change at 40: A Complete Guide",
      description: "Making a career pivot later in life? Here's everything you need to know about successfully transitioning to a new field.",
      authorName: "Sarah Jonson",
      authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      readTime: "5 min read"
    },
    {
      id: 5,
      image: img6,
      category: "Job Search",
      title: "The Hidden Job Market: How to Find Unadvertised Positions",
      description: "Up to 80% of jobs are never publicly advertised. Learn strategies to tap into the hidden job market and find your next role.",
      authorName: "Sarah Jonson",
      authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      readTime: "5 min read"
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* GRID LAYOUT */}
        {/* This creates the 3 column layout on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard 
              key={post.id}
              id={post.id}
              image={post.image}
              category={post.category}
              title={post.title}
              description={post.description}
              authorName={post.authorName}
              authorAvatar={post.authorAvatar}
              readTime={post.readTime}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BlogGrid;