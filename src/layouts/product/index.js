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
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";

function Product() {
  const [products, setProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [inactiveProducts, setInactiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [description, setDescription] = useState("");
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState("");
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
      // Разделяем товары на активные и неактивные
      const active = [];
      const inactive = [];

      jsonData.result?.forEach((product) => {
        if (product.ACTIVE === "Y") {
          active.push(product);
        } else {
          inactive.push(product);
        }
      });

      setActiveProducts(active);
      setInactiveProducts(inactive);
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
      const data = {
        partnerData: {
          name: "Заявка на модерацию товара",
          productInfo: description,
        },
      };
      const response = await fetch("/restapi/product.changePartnerProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleNewProductSubmit = async () => {
    try {
      const data = {
        partnerData: {
          name: "",
          productInfo:
            "Название товара: " +
            newProduct.name +
            "Цена: " +
            newProduct.price +
            "Описание: " +
            newProduct.description,
        },
      };
      const response = await fetch("/restapi/product.addPartnerProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
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

  const handlePriceEdit = (id, openPrice) => {
    setEditingPrice(id);
    setNewPrice(openPrice);
  };

  const handlePriceSave = async (row) => {
    try {
      const openPriceInput = document.getElementById(
        `openprice-input-${row.ELEMENT_ID}`
      );
      const newPriceInput = openPriceInput.value;
      const data = {
        productId: row.ELEMENT_ID,
        openPrice: newPriceInput,
      };
      console.log(data);
      const response = await fetch("/restapi/product.setProductOpenPrice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      if (jsonData.success) {
        setEditingPrice(null);
        fetchProducts(); // Обновляем список товаров
      }
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при сохранении цены:", error);
    }
  };

  const handlePriceCancel = () => {
    setEditingPrice(null);
    setNewPrice("");
  };

  const columns = [
    { Header: "Название", accessor: "ELEMENT_NAME" },
    { Header: "Цена", accessor: "SELFPRICE" },
    {
      Header: "Открытая цена",
      accessor: "OPEN_PRICE",
      Cell: ({ row }) => {
        if (editingPrice === row.original.ELEMENT_ID) {
          return (
            <>
              <MDBox display="flex" alignItems="center">
                {row.original.OPEN_PRICE === undefined ||
                row.original.OPEN_PRICE === null ||
                row.original.OPEN_PRICE === ""
                  ? 0
                  : row.original.OPEN_PRICE}
              </MDBox>
              <TextField
                id={`openprice-input-${row.original.ELEMENT_ID}`}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon
                        onClick={() => handlePriceSave(row.original)}
                        sx={{ cursor: "pointer", color: "success.main" }}
                      >
                        check
                      </Icon>
                      <Icon
                        onClick={handlePriceCancel}
                        sx={{ cursor: "pointer", color: "error.main", ml: 1 }}
                      >
                        close
                      </Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          );
        }
        return (
          <MDBox display="flex" alignItems="center">
            {row.original.OPEN_PRICE === undefined ||
            row.original.OPEN_PRICE === null ||
            row.original.OPEN_PRICE === ""
              ? 0
              : row.original.OPEN_PRICE}
            <Icon
              onClick={() =>
                handlePriceEdit(
                  row.original.ELEMENT_ID,
                  row.original.OPEN_PRICE
                )
              }
              sx={{ cursor: "pointer", ml: 1, fontSize: "1rem" }}
            >
              edit
            </Icon>
          </MDBox>
        );
      },
    },
    { Header: "Дата начала", accessor: "ACTIVE_FROM" },
    {
      Header: "Сайт",
      accessor: "PRODUCT_LINK",
      Cell: ({ value }) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            Ссылка
          </a>
        ) : null,
    },
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
  const columnsNoActive = [
    { Header: "Название", accessor: "ELEMENT_NAME" },
    { Header: "Цена", accessor: "SELFPRICE" },
    { Header: "Дата начала", accessor: "ACTIVE_FROM" },
    { Header: "Дата завершения", accessor: "ACTIVE_TO" },
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
              <MDBox pt={3} mx={3}>
                <MDTypography variant="h6" color="text" mb={2}>
                  Активные
                </MDTypography>
                {activeProducts.length > 0 ? (
                  <DataTable
                    table={{ columns, rows: activeProducts }}
                    loading={loading}
                    entriesPerPage={{ defaultValue: 5 }}
                    showTotalEntries
                    canSearch
                  />
                ) : (
                  <MDTypography variant="body1" color="text">
                    Активные услуги отсутствуют
                  </MDTypography>
                )}

                <MDTypography variant="h6" color="text" mt={4} mb={2}>
                  Неактивные
                </MDTypography>
                {inactiveProducts.length > 0 ? (
                  <DataTable
                    table={{ columns: columnsNoActive, rows: inactiveProducts }}
                    loading={loading}
                    entriesPerPage={{ defaultValue: 5 }}
                    showTotalEntries
                    canSearch
                  />
                ) : (
                  <MDTypography variant="body1" color="text">
                    Неактивные услуги отсутствуют
                  </MDTypography>
                )}
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
            value={newProduct.price}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, "");
              setNewProduct({ ...newProduct, price: value });
            }}
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
