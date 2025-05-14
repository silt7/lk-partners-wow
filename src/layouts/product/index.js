import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable2";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [description, setDescription] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const allIds = Cookies.get("allIds")?.split(",");
      const data = {
        allIds: allIds,
      };
      const response = await fetch("/restapi/product.getPartnerProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      setProducts(jsonData.result || {});
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setDescription(row.DESCRIPTION || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
    setDescription("");
  };

  const handleSubmit = async () => {
    try {
      // Здесь будет логика отправки изменений на сервер
      console.log("Отправка изменений:", {
        row: selectedRow,
        newDescription: description,
      });
      const data = {
        name: "123",
        description: "productInfo",
      };
      const response = await fetch("/restapi/product.changePartnerProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      console.log(jsonData);

      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleNewProductSubmit = async () => {
    try {
      const data = {
        name: "Заявка на новый товар",
        productInfo:
          "Название товара: " +
          newProduct.name +
          "Цена: " +
          newProduct.price +
          "Описание: " +
          newProduct.description,
      };
      const response = await fetch("/restapi/product.addPartnerProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      handleCloseNewProductModal();
      fetchProducts(); // Обновляем список товаров
    } catch (error) {
      console.error("Ошибка при создании нового товара:", error);
    }
  };

  const handleCloseNewProductModal = () => {
    setOpenNewProductModal(false);
    setNewProduct({
      name: "",
      price: "",
      description: "",
    });
  };

  const columns = [
    { Header: "Название", accessor: "ELEMENT_NAME" },
    { Header: "Цена", accessor: "SELFPRICE" },
    { Header: "Описание", accessor: "DESCRIPTION" },
    {
      Header: "Действия",
      accessor: "actions",
      Cell: ({ row }) => (
        <MDButton
          variant="contained"
          color="info"
          size="small"
          onClick={() => handleEdit(row.original)}
        >
          Изменить
        </MDButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Услуги
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: products }}
                  loading={loading}
                  entriesPerPage={{ defaultValue: 5 }}
                  showTotalEntries
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <MDBox mt={2} display="flex" justifyContent="flex-end">
          <MDButton
            variant="contained"
            color="success"
            onClick={() => setOpenNewProductModal(true)}
          >
            Заявка на новый товар
          </MDButton>
        </MDBox>
      </MDBox>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Редактирование описания</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="error">
            Отмена
          </MDButton>
          <MDButton onClick={handleSubmit} color="info">
            Сохранить
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openNewProductModal} onClose={handleCloseNewProductModal}>
        <DialogTitle>Заявка на новый товар</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название товара"
            fullWidth
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Цена"
            fullWidth
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseNewProductModal} color="error">
            Отмена
          </MDButton>
          <MDButton onClick={handleNewProductSubmit} color="success">
            Отправить заявку
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Product;
