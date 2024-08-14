import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const fetchStories = async (searchTerm = '') => {
  const { data } = await axios.get(`https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=100&query=${searchTerm}`);
  return data.hits;
};

const StoryCard = ({ story }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold mb-2">{story.title}</h2>
    <p className="text-sm text-gray-600 mb-2">Upvotes: {story.points}</p>
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Read More
    </a>
  </div>
);

const HackerNewsStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ['hackerNewsStories', searchTerm],
    queryFn: () => fetchStories(searchTerm),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Top 100 Hacker News Stories</h1>
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stories..."
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.objectID} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HackerNewsStories;