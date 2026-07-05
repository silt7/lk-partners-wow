import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { setAgentReport } from "../../data/setAgentReport";

function AgentReportCard({ profile }) {
  const [legalAddress, setLegalAddress] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [initialValues, setInitialValues] = useState({
    legalAddress: "",
    contractNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const address = profile?.UF_CRM_1756729018221 || "";
    const contract = profile?.UF_CRM_1684102807864 || "";

    setLegalAddress(address);
    setContractNumber(contract);
    setInitialValues({ legalAddress: address, contractNumber: contract });
  }, [profile]);

  const hasChanges =
    legalAddress !== initialValues.legalAddress ||
    contractNumber !== initialValues.contractNumber;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await setAgentReport({
        UF_CRM_1756729018221: legalAddress,
        UF_CRM_1684102807864: contractNumber,
      });

      setInitialValues({ legalAddress, contractNumber });
      setSuccess(true);
    } catch (err) {
      console.error("Ошибка при сохранении отчета агента:", err);
      setError("Не удалось сохранить данные. Попробуйте позже.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Отчет агента
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <TextField
          fullWidth
          label="Юридический адрес"
          value={legalAddress}
          onChange={(e) => {
            setLegalAddress(e.target.value);
            setSuccess(false);
          }}
          margin="normal"
          size="small"
        />
        <TextField
          fullWidth
          label="Номер договора"
          value={contractNumber}
          onChange={(e) => {
            setContractNumber(e.target.value);
            setSuccess(false);
          }}
          margin="normal"
          size="small"
        />

        {error && (
          <MDTypography variant="caption" color="error" display="block" mt={1}>
            {error}
          </MDTypography>
        )}

        {success && (
          <MDTypography variant="caption" color="success" display="block" mt={1}>
            Данные сохранены
          </MDTypography>
        )}

        {hasChanges && (
          <MDBox mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              <MDTypography variant="button" color="white" fontWeight="bold">
                {isSaving ? "Сохранение..." : "Сохранить"}
              </MDTypography>
            </Button>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

AgentReportCard.propTypes = {
  profile: PropTypes.object,
};

export default AgentReportCard;
