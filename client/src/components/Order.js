import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function Order(props) {
    const { id } = useParams()
    const [items, setItems] = useState([])
    let total = 0;

    const getReceiptItems = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/purchasedItems/findBy/${id}`)
        let items = await res.json()

        setItems(items)
    }

    const insertDecimal = (num) => {
        return (num / 100).toFixed(2);
    }

    useEffect(() => {
        getReceiptItems()
    }, [])

    return (
        <>
        <br></br>
        <br></br>
        
        <div className="store-container">
            <div className="left-panel right-border">
                <Link to="/myAccount" className="order-link"><p>{"< Back to Account"}</p></Link>
                <br></br>
                
                <br></br>
                <div className="line"></div>
                <h1 className="account-info-holder">Order Number: #{id}</h1>
                <button className="order-button">Track Order</button>
                <br></br>
                <br></br>
                <div className="line"></div>
            </div>
            <div className="right-panel">
            <br></br>
            <br></br>
                <table className="order-table">
                    <tr>
                        <td>Items</td>                       
                        <td>Price</td>
                    </tr>
                    {items.map((item, index) => {
                        total += item.price_paid
                        return (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${insertDecimal(item.price_paid)}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td>
                            <p>Total: ${insertDecimal(total)}</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <br></br>
        </>
    )
}