import { baseURL } from "@baseURL";
import axios from "axios";
import Cookies from "js-cookie";
import { startTransition, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBackCircleOutline } from "react-icons/io5";

interface Course {
  avgRating?: string;
  category?: string;
  createdAt?: string;
  description?: string;
  freeCourse?: boolean;
  imgUrl?: string;
  rating?: string;
  tags?: string[];
  title?: string;
  trending?: boolean;
  updatedAt?: string;
  videoIds?: string[];
  views?: string;
  __v?: string;
  _id?: string;
}

interface Video {
  description: string;
  dislikes: string;
  duration: string;
  id: string;
  likes: string;
  quality: string;
  thumbnailUrl: string;
  title: string;
  uploadedBy: string;
  videoSequence: string;
  videoUrl: string;
  views: string;
  watchTime: string;
}

const HeroSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [trending, setTrending] = useState<boolean>(false);

  const getCurrentCourse = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/user/course-by-courseId?id=${id}`
      );
      setCourse(response.data.course);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigation = (path: string) => [
    startTransition(() => {
      navigate(path);
    }),
  ];

  const getCurrentCourseVideos = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/user/video-by-videoId?id=${course?.videoIds}`
      );
      setVideos(response.data.videos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentCourse();
    getCurrentCourseVideos();
  }, [id, course?.videoIds]);

  const handleUpdateCourse = async () => {
    const pendingToast = toast.loading("Updating course...");
    setVideoIds(videoIds);
    try {
      const response = await axios.patch(
        `${baseURL}/admin/update-course`,
        {
          id,
          title: title || course?.title,
          description: description || course?.description,
          videoIds: videoIds.length > 0 ? videoIds : course?.videoIds,
          category: category || course?.category,
          trending: trending !== undefined ? trending : course?.trending,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.status) {
        toast.dismiss(pendingToast);
        toast.success("Course updated successfully!");
        handleNavigation("/course");
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error;
        toast.dismiss(pendingToast);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className=" w-screen p-8 pb-10 flex flex-col gap-4 ">
      <IoChevronBackCircleOutline
        onClick={() => handleNavigation("/courses")}
        className="absolute top-6 left-6 text-5xl cursor-pointer"
      />
      <h2 className="text-center text-3xl font-medium">
        Update Course:{" "}
        <span className="font-semibold text-primary">{course?.title}</span>
      </h2>
      <input
        type="text"
        placeholder={course?.title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-1/2 border placeholder:text-[#fff] rounded-md outline-none p-2 text-xl bg-[#111111]"
      />
      <div className="w-1/2 border rounded-md ">
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          placeholder={course?.description}
          className="w-full rounded-md placeholder:text-[#fff] p-2 text-lg outline-none h-16 bg-[#111111]"
        />
      </div>
      <div>
        <label>Update Videos:</label>
        <div className="grid grid-cols-4 gap-4">
          {videos.map((video, i) => (
            <div
              key={i}
              onClick={() => {
                startTransition(() => {
                  navigate(`/update-video/${video.id}`);
                });
              }}
              className="bg-[#000] cursor-pointer flex flex-col gap-2 w-72 p-2 rounded-t-md"
            >
              <img
                src={video.thumbnailUrl ? video.thumbnailUrl : course?.imgUrl}
                className="rounded-md"
              />
              <h2 className="text-lg font-medium">{video.title}</h2>
              <p className="text-base font-normal">{video.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <div>
        <ThumbnailDialog
          openThumbnailDialog={openThumbnailDialog}
          setOpenThumbnailDialog={setOpenThumbnailDialog}
          setThumbnail={setThumbnail}
        />
        <label>Thumbnail</label>
        <div
          onClick={() => setOpenThumbnailDialog(true)}
          className="border cursor-pointer rounded-md w-48 flex items-center justify-center text-lg h-28"
        >
          {thumbnail ? (
            <>
              <div
                className="w-full h-full bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${thumbnail})`,
                }}
              />
            </>
          ) : (
            " upload file"
          )}
        </div>
        {thumbnail && (
          <button
            onClick={() => setOpenThumbnailDialog(true)}
            className="mt-4 p-2 pl-6 pr-6 border rounded-md"
          >
            Choose again
          </button>
        )}
      </div> */}
      <div className="flex flex-col gap-2">
        <label>Category</label>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="w-fit p-2 rounded-md border outline-none bg-[#111111]"
        >
          <option value="">{course?.category}</option>
          <option value="Mobile Tricks">Mobile Tricks</option>
          <option value="Share Market">Share Market</option>
          <option value="YouTube">YouTube</option>
          <option value="Part Time">Part Time</option>
          <option value="Sarkari Kaam">Sarkari Kaam</option>
          <option value="Business">Business</option>
          <option value="Astrology">Astrology</option>
        </select>
      </div>
      {/* <div className="flex flex-col gap-2">
        <label> Free Course</label>
        <select
          value={free.toString()}
          onChange={(e) => setFree(e.target.value === "true")}
          className="w-fit p-2 rounded-md border outline-none bg-[#111111]"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div> */}
      <div className="flex flex-col gap-2">
        <label>Trending</label>
        <select
          value={trending.toString()}
          onChange={(e) => setTrending(e.target.value === "true")}
          className="w-fit p-2 rounded-md border outline-none bg-[#111111]"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <button
        onClick={handleUpdateCourse}
        className="w-fit p-2 pl-6 pr-6 bg-primary rounded-md"
      >
        Update Course
      </button>
    </div>
  );
};

export default HeroSection;
