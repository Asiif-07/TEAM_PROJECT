import BlogCard from './BlogCard.jsx';



const BlogGrid = ({ blogs = [] }) => {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <BlogCard
              key={post._id}
              id={post._id}
              image={post.coverImage}
              category={post.category?.name || "Uncategorized"}
              title={post.title}
              description={post.description}
              authorName={post.author?.name || "Anonymous"}
              authorAvatar={post.author?.avatar || "https://i.pravatar.cc/150"}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-500">No blogs found.</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogGrid;