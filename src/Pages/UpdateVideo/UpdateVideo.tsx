import { baseURL } from "@baseURL";
import ThumbnailDialog from "@creators/Components/ThumbnailDialog/ThumbnailDialog";
import Dialog from "@dialog";
import axios from "axios";
import Cookies from "js-cookie";
import { startTransition, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

interface Video {
  description: string;
  dislikes: string;
  duration: string;
  id: string;
  likes: string;
  quality: string;
  title: string;
  uploadedBy: string;
  videoSequence: string;
  videoUrl: string;
  views: string;
  watchTime: string;
}

const UpdateVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = Cookies.get("token");

  const [deleteVideoDialog, setDeleteVideoDialog] = useState<boolean>(false);
  const [openThumbnailDialog, setOpenThumbnailDialog] =
    useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [video, setVideo] = useState<Video[]>([]);

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/user/video-by-videoId?id=${id}`
      );
      setVideo(response.data.videos[0]);
      setTitle(response.data.videos[0].title);
      setDescription(response.data.videos[0].description);
      setThumbnail(response.data.videos[0].thumbnailUrl);
      setVideo(video);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    getVideo();
  }, [id]);

  const handleVideoUpdate = async () => {
    const pendingToast = toast.loading("Updating video...");
    try {
      const response = axios.patch(
        `${baseURL}/admin/update-video`,
        {
          id,
          title,
          description,
          thumbnailUrl: thumbnail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log((await response).data);
      if ((await response).data.status) {
        toast.dismiss(pendingToast);
        toast.success("Video updated!");
        startTransition(() => {
          navigate("/courses");
        });
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

  const handleDeleteVideo = async () => {
    const pendingToast = toast.loading("Deleting Video...");
    try {
      const response = await axios.delete(
        `${baseURL}/admin/delete-video?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        toast.dismiss(pendingToast);
        toast.success("Video Deleted");
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.dismiss(pendingToast);
        const errorMessage = error.response?.data.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleNavigation = (path: string) => [
    startTransition(() => {
      navigate(path);
    }),
  ];

  return (
    <div className="w-screen h-screen overflow-scroll flex flex-col gap-4 p-8">
      <IoChevronBackCircleOutline
        onClick={() => handleNavigation("/courses")}
        className="absolute top-6 left-6 text-5xl cursor-pointer"
      />
      <h2 className="text-center text-3xl">Update Video</h2>
      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-md placeholder:text-[#fff] w-1/2 bg-[#111111] p-3"
      />
      <div className="border rounded-md placeholder:text-[#fff] w-1/2 p-2 bg-[#111111]">
        <textarea
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full placeholder:text-[#fff] h-full outline-none rounded-md bg-[#111111]"
        />
      </div>

      <div>
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
      </div>
      {/* <div className="flex flex-col gap-2 w-1/2 p-3 rounded-md">
        <p>Thumbnail</p>
        <div className="flex gap-6">
          {thumbnailUrl ? (
            <div>
              <div
                className="w-48 h-28 bg-primary bg-cover bg-no-repeat rounded-md"
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
              />
              <button
                onClick={() => setOpen(true)}
                className="p-2 pl-5 pr-5 transition-all duration-300 rounded-full mt-2 hover:bg-[#1b1b1b]"
              >
                Choose again
              </button>
            </div>
          ) : (
            <div
              onClick={() => setOpen(true)}
              className="w-48 h-28 rounded-md border flex flex-col justify-center items-center"
            >
              <MdOutlineFileUpload className="text-4xl cursor-pointer transition-all duration-150 p-1 hover:bg-[#1a1a1a] rounded-full" />

              <label className="cursor-pointer"> Upload File</label>
            </div>
          )}

          <div
            className="w-48 h-28 rounded-md border"
            style={{
              backgroundImage: `url(${BG})`,
              backgroundSize: "cover",
            }}
          >
            <div className="w-full h-full bg-[#1a1a1a83] rounded-md flex flex-col justify-center items-center">
              <RiAiGenerate className="text-4xl cursor-pointer transition-all duration-150 p-1 hover:bg-[#1a1a1a] rounded-full" />
              <p className="cursor-pointer">Auto-Generated</p>
            </div>
          </div>
        </div>
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          className="hidden"
          ref={hiddenInput}
          accept={`image/${imgType || "png,jpeg,jpg"}`}
        />
        <Dialog width={400} open={open} onClose={() => null}>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-2xl"
          >
            <IoMdClose />
          </button>
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
            <p>Image Type</p>
            <select
              className="bg-[#000] text-center p-2 border outline-none rounded-md"
              onChange={(e) => setImgType(e.target.value)}
            >
              <option value="">Select Image Type</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div className="w-full mt-4 h-full flex flex-col gap-2 justify-center items-center">
            <p>Image Content</p>
            <input
              type="text"
              className="p-2 w-2/3 border rounded-md bg-[#000] text-[#fff]"
              placeholder="Bussiness"
            />
            <button
              onClick={handleChooseFile}
              className="mt-4 p-2 pl-5 pr-5 bg-primary rounded-md"
            >
              Done
            </button>
          </div>
        </Dialog>
      </div> */}
      <div className="flex gap-4">
        <Dialog open={deleteVideoDialog} width={600} onClose={() => null}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="text-primary font-semibold">"{title}"</span>
            </p>
            <div className="flex gap-10 items-center">
              <button
                onClick={() => setDeleteVideoDialog(false)}
                className="border p-2 pl-6 pr-6 w-fit rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="bg-primary p-2 pl-6 pr-6 w-fit rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </Dialog>
        <button
          onClick={() => setDeleteVideoDialog(true)}
          className="border p-2 pl-6 pr-6 w-fit rounded-md"
        >
          Delete Video
        </button>
        <button
          onClick={handleVideoUpdate}
          className="bg-primary p-2 pl-6 pr-6 w-fit rounded-md"
        >
          Update Video
        </button>
      </div>
    </div>
  );
};

export default UpdateVideo;
