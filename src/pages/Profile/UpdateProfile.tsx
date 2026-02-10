import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function UpdateProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current user on component mount
  useEffect(() => {
    // TODO: Get user from auth context/localStorage
    const mockUser = {
      name: "Sammy Dach",
      password: "BOO0234",
      email: "sammy.dach@student.nms.edu",
      matricNumber: "BD4567890",
      admissionDate: "27/09/2024",
      class: "J.S.S 2",
      dateOfBirth: "15/03/2010",
      gender: "Male",
      religion: "Christian",
      phone: "09067255677",
      bloodGroup: "A+",
      disease: "HIV",
      orphan: "No",
      previousSchool: "No",
      address: "5663 VonRueden Lock",
      fatherName: "Leonard Bosco",
      fatherOccupation: "Carpenter",
      fatherMobile: "0907864556",
      fatherEducation: "BSC",
      fatherAddress: "5663 VonRueden Lock",
      motherName: "Mary Pedo",
      motherOccupation: "Nurse",
      motherMobile: "0907864556",
      motherEducation: "BSC",
      motherAddress: "5663 VonRueden Lock",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    };
    setCurrentUser(mockUser);
    setUsername(mockUser.name);
    setPassword(mockUser.password);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    setIsUpdating(true);

    try {
      // TODO: Call profile update API when backend is ready
      const updatedUser = { ...currentUser, name: username, password: password };
      setCurrentUser(updatedUser);
      alert("Profile updated successfully! (Demo mode)");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-xl text-center font-semibold">Update Profile</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card - Current Profile (3 columns) */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden">
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full space-y-3 text-center">
            <div>
              <p className="font-semibold text-sm" style={{ color: "#13A541" }}>Username</p>
              <p className="text-gray-800">{currentUser.name}</p>
            </div>

            <div>
              <p className="font-semibold text-sm" style={{ color: "#13A541" }}>Password</p>
              <p className="text-gray-800">{currentUser.password}</p>
            </div>
          </div>
        </div>

        {/* Center Card - Update Form (4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Sammy Dash"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="BOO0234"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={isUpdating}
              style={{ backgroundColor: "#13A541" }}
              className="w-full text-white py-2.5 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </form>
        </div>

        {/* Right Card - Student Information (5 columns) */}
        <div
          className="lg:col-span-5 bg-white shadow-md overflow-y-auto"
          style={{
            width: "327px",
            maxHeight: "800px",
            borderRadius: "14px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            opacity: 1,
            padding: "24px",
            marginLeft: "auto"
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-3 overflow-hidden">
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{currentUser.name}</h3>
          </div>

          <div className="space-y-4 text-sm">
            {/* Student Information */}
            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Matric Number</p>
              <p className="font-medium text-gray-800">{currentUser.matricNumber}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Date of Admission</p>
              <p className="font-medium text-gray-800">{currentUser.admissionDate}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Class</p>
              <p className="font-medium text-gray-800">{currentUser.class}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Date Of Birth</p>
              <p className="font-medium text-gray-800">{currentUser.dateOfBirth}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Gender</p>
              <p className="font-medium text-gray-800">{currentUser.gender}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Religion</p>
              <p className="font-medium text-gray-800">{currentUser.religion}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Phone number WhatsApp</p>
              <p className="font-medium text-gray-800">{currentUser.phone}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Blood Group</p>
              <p className="font-medium text-gray-800">{currentUser.bloodGroup}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Disease</p>
              <p className="font-medium text-gray-800">{currentUser.disease}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Orphan</p>
              <p className="font-medium text-gray-800">{currentUser.orphan}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Previous school</p>
              <p className="font-medium text-gray-800">{currentUser.previousSchool}</p>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-400 text-xs mb-1">Address</p>
              <p className="font-medium text-gray-800">{currentUser.address}</p>
            </div>

            {/* Father/Guardian Information */}
            <div className="pt-4">
              <h4 className="font-semibold text-base mb-4 text-gray-900">Father/Guardian Information</h4>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Father's Full Name</p>
                  <p className="font-medium text-gray-800">{currentUser.fatherName}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Occupation</p>
                  <p className="font-medium text-gray-800">{currentUser.fatherOccupation}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Mobile No.</p>
                  <p className="font-medium text-gray-800">{currentUser.fatherMobile}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Education</p>
                  <p className="font-medium text-gray-800">{currentUser.fatherEducation}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <p className="font-medium text-gray-800">{currentUser.fatherAddress}</p>
                </div>
              </div>
            </div>

            {/* Mother Information */}
            <div className="pt-4">
              <h4 className="font-semibold text-base mb-4 text-gray-900">Mother Information</h4>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Mother's Full Name</p>
                  <p className="font-medium text-gray-800">{currentUser.motherName}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Occupation</p>
                  <p className="font-medium text-gray-800">{currentUser.motherOccupation}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Mobile No.</p>
                  <p className="font-medium text-gray-800">{currentUser.motherMobile}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-gray-400 text-xs mb-1">Education</p>
                  <p className="font-medium text-gray-800">{currentUser.motherEducation}</p>
                </div>

                <div className="pb-3">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <p className="font-medium text-gray-800">{currentUser.motherAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
