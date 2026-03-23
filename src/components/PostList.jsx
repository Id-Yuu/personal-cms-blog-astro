import { useState } from 'react';

export default function PostList({ initialPosts, postsPerPage }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // If the initial fetch returned exactly the limit, there MIGHT be more posts.
  const [hasMore, setHasMore] = useState(initialPosts.length === parseInt(postsPerPage));

  const loadMorePosts = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    
    try {
      // Fetch next page, sorted newest first
      const res = await fetch(`http://localhost:4000/posts?_sort=id&_order=desc&_page=${nextPage}&_limit=${postsPerPage}`);
      const newPosts = await res.json();
      
      setPosts([...posts, ...newPosts]);
      setPage(nextPage);
      
      // If the API returns fewer posts than our limit, we've reached the end
      if (newPosts.length < parseInt(postsPerPage)) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="blog">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h2>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </h2>
          <div className="post-preview">
            {post.image && (
               <div className="image">
                 <img src={post.image} alt={post.title} />
               </div>
            )}
            <div className="post-preview-content">
              <p className="post-preview-text">
                {(post.content || '').replace(/<[^>]*>?/gm, '')}
              </p>
              <a href={`/posts/${post.id}`} className="btn" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Read More</a>
            </div>
          </div>
        </div>
      ))}
      
      {posts.length === 0 && <p>No posts available yet.</p>}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={loadMorePosts} className="btn" disabled={isLoading} style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </div>
  );
}