"use client";

import {
  Check,
  Download,
  Home,
  Printer,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useRef } from "react";
import * as Actions from "@/store/store";
import moment from "moment";
import Link from "next/link";

export const Invoice = () => {
  const contentRef = useRef(null);

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { customer_details } = orderDetails?.order || {};
  const { reservationResults } = orderDetails?.reservation || {};

  const { finalReservationDetails, BookingTran, OverallTotal } = useSelector(
    (state) => state.pricing,
  );

  const [cashFreePaymentVerifyQuery, options] =
    Actions.api.useLazyCashFreePaymentVerifyQuery();
  const [paymentDetails] = options.data || [];

  const {
    cf_payment_id,
    order_amount,
    payment_group,
    payment_completion_time,
    payment_status,
  } = paymentDetails ?? {};

  const [getFinalReservationDetailsWeb, finalReservationOptions] =
    Actions.api.useGetFinalReservationDetailsWebMutation();

  useEffect(() => {
    async function callAPI() {
      const ids = localStorage.getItem("reservationIDs");
      if (ids) {
        const parsedIds = JSON.parse(ids);
        const data = await getFinalReservationDetailsWeb({
          reservationIDs: parsedIds,
          hotelID: 10,
        });
        dispatch(
          Actions.pricingActions.setFinalReservationDetails(data?.data?.data),
        );
      }
    }
    callAPI();
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("reservationConfirmation");
    if (data) {
      dispatch(Actions.orderDetailsActions.setReservation(JSON.parse(data)));
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("orderDetails");
    if (data) {
      const parsedData = JSON.parse(data);
      dispatch(Actions.orderDetailsActions.setOrderDetails(parsedData));
    }
  }, []);

  useEffect(() => {
    const orderID = sessionStorage.getItem("orderID");
    if (orderID) {
      cashFreePaymentVerifyQuery(orderID);
    }
  }, []);

  useEffect(() => {
    const BookingTran = sessionStorage.getItem("pricing:BookingTran");
    const OverallTotal = sessionStorage.getItem("pricing:OverallTotal");
    const finalReservation = sessionStorage.getItem(
      "pricing:finalReservationDetails",
    );
    if (BookingTran) {
      const data = JSON.parse(BookingTran);
      dispatch(Actions.pricingActions.setBookingTran(data));
    }
    if (OverallTotal) {
      const data = JSON.parse(OverallTotal);
      dispatch(Actions.pricingActions.setOverallTotal(data));
    }
    if (finalReservation) {
      const data = JSON.parse(finalReservation);
      dispatch(Actions.pricingActions.setFinalReservationDetails(data));
    }
  }, []);

  const handlePrint = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = contentRef.current;
    const options = {
      filename: `Invoice_${cf_payment_id}_(${customer_details?.customer_name}).pdf`,
      margin: 0.5,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  const statusConfig = {
    SUCCESS: {
      color: "#166534",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      iconBgColor: "#22c55e",
      icon: Check,
      label: "Paid",
      message: "Your reservation was submitted successfully!",
      labelBgColor: "#dcfce7",
      labelTextColor: "#166534",
    },
    PENDING: {
      color: "#854d0e",
      bgColor: "#fefce8",
      borderColor: "#fef08a",
      iconBgColor: "#eab308",
      icon: Clock,
      label: "Pending",
      message: "Your reservation is pending payment confirmation.",
      labelBgColor: "#fef9c3",
      labelTextColor: "#854d0e",
    },
    FAILED: {
      color: "#9f1239",
      bgColor: "#fef2f2",
      borderColor: "#fecaca",
      iconBgColor: "#ef4444",
      icon: AlertTriangle,
      label: "Failed",
      message: "Your payment was unsuccessful. Please try again.",
      labelBgColor: "#fee2e2",
      labelTextColor: "#9f1239",
    },
  };

  const config = statusConfig[payment_status] ?? {};
  const StatusIcon = config.icon;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "8px",
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--color-dark-3)",
            color: "white",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "0",
                }}
              >
                LUXURY STAYS
              </h1>
              <p
                style={{
                  color: "#bfdbfe",
                  margin: "4px 0 0 0",
                }}
              >
                Premium Hotel & Resorts
              </p>
            </div>
            <div
              style={{
                backgroundColor: "white",
                color: "#1e40af",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              INVOICE
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ padding: "24px" }}>
          {/* Customer and Invoice Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  margin: "0 0 8px 0",
                }}
              >
                Invoice To:
              </h2>
              <div style={{ marginTop: "8px" }}>
                <p
                  style={{
                    fontWeight: "500",
                    margin: "0 0 4px 0",
                  }}
                >
                  {customer_details?.customer_name ?? "N/A"}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    margin: "0 0 4px 0",
                  }}
                >
                  {customer_details?.customer_email ?? "N/A"}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    margin: "0",
                  }}
                >
                  {customer_details?.customer_phone ?? "N/A"}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Invoice Number:</span>
                  <span style={{ fontWeight: "500" }}>INV-{cf_payment_id}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    margin: "0 0 4px 0",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Invoice Date:</span>
                  <span style={{ fontWeight: "500" }}>
                    {payment_completion_time
                      ? moment(payment_completion_time).format(
                          "ddd DD MMM YYYY",
                        )
                      : "N/A"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Booking Date:</span>
                  <span style={{ fontWeight: "500" }}>
                    {payment_completion_time
                      ? moment(payment_completion_time).format(
                          "ddd DD MMM YYYY",
                        )
                      : "N/A"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Payment Status:</span>
                  <span
                    style={{
                      backgroundColor: config.labelBgColor,
                      color: config.labelTextColor,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {config.label ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div
            style={{
              backgroundColor: config.bgColor,
              border: `1px solid ${config.borderColor}`,
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: config.iconBgColor,
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!StatusIcon ? null : (
                <StatusIcon
                  style={{
                    height: "16px",
                    width: "16px",
                    color: "white",
                  }}
                />
              )}
            </div>
            <p
              style={{
                color: config.color,
                fontWeight: "500",
                margin: "0",
              }}
            >
              {config.message}
            </p>
          </div>
          {/* Invoice Table */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "34px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Confirmation Number
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Check-in
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Check-out
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {BookingTran?.length == 0 ? (
                  <tr>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      N/A
                    </td>
                  </tr>
                ) : (
                  BookingTran?.map((reservation, index) => (
                    <React.Fragment key={finalReservationDetails[index]?.id}>
                      <tr>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "500",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {finalReservationDetails[index]?.bookingID}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "500",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {reservation?.RentalInfo?.roomType}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {moment(reservation?.Start).format("ddd DD MMM YYYY")}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {moment(reservation?.End).format("ddd DD MMM YYYY")}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN", {
                            currency: "INR",
                            style: "currency",
                            currencyDisplay: "symbol",
                          }).format(
                            reservation?.RentalInfo?.baseprice ?? 0.0,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "500",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "500",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {reservation?.RentalInfo?.webDescription}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            currencyDisplay: "symbol",
                          }).format(reservation?.RentalInfo?.packageRate)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Totals */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "24px",
            }}
          >
            <div style={{ width: "320px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#4b5563" }}>Subtotal:</span>
                <span>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).format(OverallTotal?.OverAllTotalAmountBeforeTax ?? 0.0)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#4b5563" }}>Taxes (Included):</span>
                <span>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).format(OverallTotal?.OverAllTotalTax ?? 0.0)}
                </span>
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                  margin: "8px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).format(OverallTotal.OverAllTotalAmountAfterTax ?? 0.0)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                <span>Payment Method:</span>
                <span>{payment_group ?? "N/A"}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <span>Payment ID:</span>
                <span>{cf_payment_id ?? "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Payment Action for Pending/Failed */}
          {payment_status !== "SUCCESS" && (
            <div
              style={{
                backgroundColor:
                  payment_status === "PENDING" ? "#fefce8" : "#fef2f2",
                padding: "16px",
                borderRadius: "8px",
                border: `1px solid ${payment_status === "PENDING" ? "#fef08a" : "#fecaca"}`,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: payment_status === "PENDING" ? "#854d0e" : "#9f1239",
                  marginTop: "0",
                  marginBottom: "12px",
                  fontWeight: "500",
                }}
              >
                {payment_status === "PENDING"
                  ? "Please complete your payment to confirm your reservation."
                  : "Your payment was unsuccessful. Please try again with a different payment method."}
              </p>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor:
                    payment_status === "PENDING" ? "#eab308" : "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {payment_status === "PENDING"
                  ? "Complete Payment"
                  : "Try Again"}
              </button>
            </div>
          )}

          {/* Policies */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontWeight: "500",
                marginTop: "0",
                marginBottom: "8px",
              }}
            >
              Booking Policies:
            </h3>
            <ul
              style={{
                fontSize: "14px",
                color: "#4b5563",
                paddingLeft: "0",
                listStyle: "none",
                margin: "0",
              }}
            >
              <li>• Check-in time: 2:00 PM, Check-out time: 12:00 PM</li>
              <li>• Free cancellation up to 48 hours before check-in</li>
              <li>• Photo ID required at check-in</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0 0 4px 0",
              }}
            >
              Thank you for choosing us!
            </p>
            {/* <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0",
              }}
            >
              For any inquiries, please contact: support@luxurystays.com
            </p> */}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "var(--color-dark-3)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={handlePrint}
            >
              <Download style={{ height: "16px", width: "16px" }} />
              Download
            </button>
          </div>
        </div>
      </div>

      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "24px",
          padding: "8px 16px",
          backgroundColor: "transparent",
          color: "#374151",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        <Home style={{ height: "16px", width: "16px" }} />
        Back Home
      </Link>
    </div>
  );
};
