import { useEffect, useState } from "react"

import '../stylesheets/account.css'
import { Link } from "react-router-dom"

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export function PurchaseHistory(props) {
    let [receipts, setReceipts] = useState([])

    const getReceipts = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/receipts/ByOwnerId/${props.userId}`)
        let receiptArr = await res.json()
        setReceipts(receiptArr)
    }

    useEffect(() => {
        getReceipts()
    }, [])

    const convertDate = str => {
        let firstDigit = str.charAt(5)
        let secondDigit = str.charAt(6)
        let month = firstDigit + secondDigit
        month = Number(month)
        month = MONTHS[month - 1]
        let returnString = `${month}-${str.charAt(8)}${str.charAt(9)}-${str.charAt(0)}${str.charAt(1)}${str.charAt(2)}${str.charAt(3)}`

        return returnString
    }

    return (
        <table className="purchase-history-table">
            <tbody>
                <tr>
                    <td>Order</td>
                    <td>Date</td>
                    <td>Payment Status</td>
                    <td>Fulfillment Status</td>
                    <td>Total</td>
                </tr>
                {receipts.map((receipt, index) => {
                    return (
                        <tr key={index}>
                            <td><Link to={`/order/${receipt.id}`} className="purchase-order-link">#{receipt.id}</Link>  </td>
                            <td>{convertDate(receipt.date.slice(0,10))}</td>
                            <td>{receipt.payment_status}</td>
                            <td>{receipt.fulfillment_status}</td>
                            <td>${receipt.total}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}