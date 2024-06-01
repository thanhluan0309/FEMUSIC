import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  GET_ALL_CATEGORY,
  Create_Category,
  Delete_Category,
  Delete_USER,
  Update_Category,
  Update_Role_For_User,
  GET_ALL_USER,
} from "../../../api/handleAdmin";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { useMutation } from "@tanstack/react-query";
import {
  FormWrapper,
  FormTitle,
  FormField,
  Label,
  Input,
  style,
  ErrorMessage,
  columns_category,
} from "../Components/components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ListCategory = () => {
  const data_all_user = useQuery({
    queryKey: ["getAllUser"],
    queryFn: async () => {
      const rs = await GET_ALL_USER();
      return rs;
    },
  });

  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectedRow, setSelectRow] = React.useState([]);
  const [isloadingSubmit, setIsloadingSubmit] = React.useState(false);

  //Modal Edit
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => {
    setFormData(selectedRow[0]);

    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const mutation_EditRole = useMutation({
    mutationFn: (body) => {
      return Update_Role_For_User(body);
    },
  });
  const [errors, setErrors] = React.useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      roles: value,
    });
  };

  const HandleSelect = (newselectionmodel) => {
    const selectedRows = newselectionmodel.map((selectedId) =>
      data_all_user?.data?.alluser
        .map((obj, index) => ({
          ...obj,
          id: obj._id, // Hoặc một giá trị id khác tùy ý bạn
        }))
        .find((row) => row.id === selectedId)
    );
    setSelectRow(selectedRows);
    setSelectionModel(newselectionmodel);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    let formdata = {
      _id: selectedRow[0]._id,
      roles: formData.roles,
    };
    mutation_EditRole.mutate(formdata, {
      onSuccess: (data) => {
        console.log("data " + JSON.stringify(data));

        if (data.success) {
          alert(data.message);
          data_all_user.refetch();
          setFormData({
            roles: 2,
          });
          setSelectRow([]);
          setSelectionModel([]);
          setOpenEdit(false);
        }
      },
    });
  };

  const [formData, setFormData] = React.useState({
    roles: 2,
  });

  const handleDelete = async () => {
    const ApiPromises = [];
    selectedRow.forEach((item, index) => {
      let formDeleted = {
        _id: item._id,
      };
      ApiPromises.push(Delete_USER(formDeleted));
    });
    try {
      await Promise.all(ApiPromises);
      alert("Xoá thành công");
      data_all_user.refetch();
      setSelectRow([]);
      setSelectionModel([]);
    } catch (error) {
      console.error("Error creating products:", error);
    }
  };

  return (
    <>
      <>
        <Box pl={3} pr={3} pt={5}>
          <Box mb={5}>
            <Typography fontWeight={700} variant="h4" color={"Highlight"}>
              Danh Mục
            </Typography>
          </Box>

          <Box mb={5}>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              {/* <Button
                sx={{ backgroundColor: "red" }}
                disabled={selectionModel.length === 0}
                onClick={handleDelete}
              >
                Xoá
              </Button> */}
              <Button
                onClick={handleOpenEdit}
                sx={{ backgroundColor: "orangered" }}
                disabled={selectionModel.length !== 1}
              >
                Sửa
              </Button>
            </ButtonGroup>
            <Box>
              {/* MODAL EDIT */}
              <React.Fragment>
                <Modal
                  open={openEdit}
                  onClose={handleCloseEdit}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                >
                  <Box sx={{ ...style, width: 700 }}>
                    <FormWrapper>
                      <FormTitle>Điều chỉnh danh mục</FormTitle>

                      <form onSubmit={handleSubmitEdit}>
                        <FormField>
                          <Label htmlFor="name">Chức vụ:</Label>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Chức vụ
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                              >
                                <MenuItem value={0}>QUẢN TRỊ VIÊN</MenuItem>
                                <MenuItem value={2}>NGƯỜI THAM GIA</MenuItem>

                                <MenuItem value={1}>
                                  ---BAN NGƯỜI DÙNG---
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </FormField>
                        {isloadingSubmit ? (
                          <Button>loading...</Button>
                        ) : (
                          <Button color="success" type="submit">
                            Điều chỉnh
                          </Button>
                        )}

                        <Button onClick={handleCloseEdit}>x</Button>
                      </form>
                    </FormWrapper>
                  </Box>
                </Modal>
              </React.Fragment>
            </Box>
          </Box>

          <Box
            height={"40vh"}
            width={"100%"}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#674dbf",
                color: "white",
                borderBottom: "none",
              },
            }}
          >
            <DataGrid
              sx={{ backgroundColor: "white", fontSize: "1.4rem" }}
              rows={
                data_all_user?.data?.alluser.map((obj, index) => ({
                  ...obj,
                  id: obj._id, // Hoặc một giá trị id khác tùy ý bạn
                })) || []
              }
              columns={columns_category}
              selectionModel={selectionModel}
              onSelectionModelChange={HandleSelect}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </Box>
        </Box>
      </>
    </>
  );
};
export default ListCategory;
