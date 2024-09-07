import { createClient } from "@/utils/supabase/server";
import ProfileImage from "@/components/ProfileImage";

const ProfilePage = async () => {
  const supabase = createClient();

  // Get the authenticated user's email from the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <p>User not authenticated.</p>
      </div>
    );
  }

  // Fetch the user's data from the apidata table using the email
  const { data, error } = await supabase
    .from("apidata")
    .select("name, studentid, uniqueid, email, dplink, linkedin, batch, session, department, admissionroll, admissionmerit, hall, bloodgroup, phonenumber, currentstatus")
    .eq("email", user.email)
    .single();

  if (error || !data) {
    return (
      <div>
        <p>Error fetching profile data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3>Profile Page</h3>

      <div>
        <strong>Profile Picture:</strong>
        <ProfileImage src={data.dplink} />
      </div>

      <p>
        <strong>Name:</strong> {data.name}
      </p>
      <p>
        <strong>Student ID:</strong> {data.studentid}
      </p>
      <p>
        <strong>Unique ID:</strong> {data.uniqueid}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      <p>
        <strong>LinkedIn:</strong> {data.linkedin}
      </p>
      <p>
        <strong>Batch:</strong> {data.batch}
      </p>
      <p>
        <strong>Session:</strong> {data.session}
      </p>
      <p>
        <strong>Department:</strong> {data.department}
      </p>
      <p>
        <strong>Admission Roll:</strong> {data.admissionroll}
      </p>
      <p>
        <strong>Admission Merit:</strong> {data.admissionmerit}
      </p>
      <p>
        <strong>Hall:</strong> {data.hall}
      </p>
      <p>
        <strong>Blood Group:</strong> {data.bloodgroup}
      </p>
      <p>
        <strong>Phone Number:</strong> {data.phonenumber}
      </p>
      <p>
        <strong>Current Status:</strong> {data.currentstatus}
      </p>
    </div>
  );
};

export default ProfilePage;
