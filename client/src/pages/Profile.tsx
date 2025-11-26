
import { store } from "../lib/store";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import Registration from "./Registration";
import UserInfo from "./UserInfo"
const Profile = () => {
  // const { currentUser, isLoading } = store();
  return (
    <Container>
      <UserInfo/>
    </Container>
  );
};

export default Profile;
