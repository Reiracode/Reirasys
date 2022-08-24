import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../Context";
import AddUserForm from "./forms/AddUserForms";
import EditUserForm from "./forms/EditUserForm";
import ListTable from "./tables/ListTable";
import OpenModal from "./tools/OpenModal";
import singleton from "../Singleton";
import axios from "axios";
// // confirm dialog
// https://www.taniarascia.com/crud-app-in-react-with-hook //

const PrForm = (props) => {
  let navigate = useNavigate();
  // global state:userno
  const { userno, dep } = useAuthState();
  
  let today = new Date().toISOString().substring(0, 10);
  const initialFormState = { username: userno, userdep: dep, userdate: today };
  const [listHead, setListHead] = useState(initialFormState);

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [editing, setEditing] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const [show, SetShow] = useState(false);
  const [formNames, setFormNames] = useState("add");

  const handOpen = () => {
    setOpenBox(!openBox);
    SetShow(true);
  };

  const showModa = () => {
    SetShow(!show);
    setFormNames("add");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setListHead({ ...listHead, [name]: value });
  };

  // CRUD operations
  const addUser = (user) => {
    console.log(users);
    //一開始 新增資料
    if (users.length == 0) {
      user.id = users.length + 1;
    } else {
      let maxid = users.slice(-1)[0].id;
      user.id = maxid + 1;
    }

    // user.id = users.length + 1;
    setUsers([...users, user]);
  };

  const deleteUser = (id) => {
    setEditing(false);
    setUsers(users.filter((user) => user.id !== id));
  };

  const updateUser = (id, updatedUser) => {
    setEditing(false);
    setFormNames("edit");
    setUsers(users.map((user) => (user.id === id ? updatedUser : user)));

    showModa();
  };

  const editRow = (user) => {
    setEditing(true);
    setFormNames("edit");
    setCurrentUser({
      id: user.id,
      name: user.name,
      username: user.username,
      smallp: user.smallp,
      datatime: user.datatime,
    });
  };

  async function makeGetRequest() {
    let payload = {
      heads: listHead,
      bodys: users,
    };

    console.log(payload);
    //********* create *********
    // axios
    //   .post("/customer", payload)
    //   .then((res) => {
    //     console.table(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // ********* DELETE *********
    // let delno = "19";
    // axios.delete(`/customers/${delno}`).then((res) => console.log(res.data));
  }

  //  submit form
  const handleSubmit = (evt) => {
    // makeGetRequest();
    evt.preventDefault();
    if (!users.length) {
      alert("請選單");
      return;
    }


    console.log(JSON.stringify(listHead));
    let data = {
      header: listHead,
      header_detail: users,
    };
    console.log(JSON.stringify(data));
    //-----------------------------------------
    // fetch(singleton.domainName + "/form_post_prform.php", {
    //   method: "POST", // or 'PUT'
    //   body: JSON.stringify(data),
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     console.log("Success:", JSON.stringify(response));
    //     if ((response = "sucess")) {
    //       console.log("遞迴");
    //       props.history.push("/poform");
    //     }
    //   })
    //   .catch((error) => console.error("Error:", error));
    const fakedata = {"name": "morpheus","job": "leader"}
      
      axios .post("https://reqres.in/api/users", data)
      .then((res) => {
        const ressponse = res.data;
        console.log(ressponse)
        if (ressponse.createdAt ) {
          alert("SUCCESS")
          navigate('/poform')
          // props.history.push("/poform");
        }
        // createdAt: "2022-08-24T08:06:44.929Z"
      })
      .catch((error) => {
        console.error(error);
      });

    
    
  };

  return (
    <section className="container contact">
      <h1>PR請購單</h1>
      <div className="flex_form">
        <form id="myForm">
          <div className="flex-large">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputUsername">員工姓名</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputUsername"
                  name="username"
                  value={listHead.username}
                  // value={userDetails.userno}
                  onChange={handleInputChange}
                  placeholder="員工姓名"
                  autoFocus={true}
                  required
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="inputUserdep">員工部門</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputUserdep"
                  name="userdep"
                  value={listHead.userdep}
                  onChange={handleInputChange}
                  placeholder="員工部門"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputUsertime">需用時間</label>
                <input
                  type="date"
                  className="form-control"
                  id="inputUsertime"
                  name="userdate"
                  value={listHead.userdate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="flex-list">
          <OpenModal
            show={show}
            handleClose={() => {
              SetShow(false);
            }}
            onClickOutside={() => {
              SetShow(false);
            }}
          >
            {formNames === "add" ? (
              <AddUserForm addUser={addUser} SetShow={SetShow} />
            ) : formNames === "edit" ? (
              <EditUserForm
                editing={editing}
                setEditing={setEditing}
                currentUser={currentUser}
                updateUser={updateUser}
                SetShow={SetShow}
              />
            ) : null}
          </OpenModal>

          <button className="btn add_item" type="button" onClick={showModa}>
            +請購項目
          </button>

          <ListTable
            isOpen={handOpen}
            users={users}
            editRow={editRow}
            deleteUser={deleteUser}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          submit
        </button>
      </div>
    </section>
  );
};

export default PrForm;
