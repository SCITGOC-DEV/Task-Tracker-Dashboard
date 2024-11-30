import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useState} from "react";
import Header from "../../components/Header";
import {InputFieldWithSuggestion} from "../../components/TextFieldWithSuggestions";
import PageRoutes from "../../utils/PageRoutes";
import {InventoriesStatusValues, ProjectStatusValues} from "../../utils/ProjectStatus";
import {useStateContext} from "../../contexts/ContextProvider";
import {ActivityIndicator} from "react-native-web";
import {InputWithError} from "../../components/InputWithError";
import {InputButton} from "../../components/InnputButton";
import {AppCheckBox} from "../../components/AppCheckBox";
import {useLazyQuery, useMutation} from "@apollo/client";
import {getInventoryCategoriesByName} from "../../graphql/query/inventoryCategoryQueries";
import {ADD_INVENTORY} from "../../graphql/query/inventoryQueries";
import {data} from "autoprefixer";
import useAuth from "../../hooks/useAuth";
import {toast} from "react-toastify";
import AppDropdown from "../../components/AppDropdown";

const AddInventory = () => {
    const {currentColor} = useStateContext();

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)
    const {role} = useAuth()
    const {id} = useParams()

    const today = new Date().toISOString();

    const [unitsOnRequest, setUnitsOnRequest] = useState(0);
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [scitControlNumber, setScitControlNumber] = useState('');
    const [supplier, setSupplier] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [datePurchaseReceived, setDatePurchaseReceived] = useState(today);
    const [dateRelease, setDateRelease] = useState(today);
    const [totalUnitRelease, setTotalUnitRelease] = useState(0);
    const [deliveredToClient, setDeliveredToClient] = useState('');
    const [deliveryReceiptNo, setDeliveryReceiptNo] = useState('');
    const [unitReturn, setUnitReturn] = useState(0);
    const [locationStock, setLocationStock] = useState('');
    const [dateReturn, setDateReturn] = useState(today);
    const [stockOffice, setStockOffice] = useState(0);
    const [totalStockAmount, setTotalStockAmount] = useState(0);
    const [serialNumberStart, setSerialNumberStart] = useState('');
    const [serialNumberEnd, setSerialNumberEnd] = useState("");
    const [isReturn, setIsReturn] = useState(false);
    const [type, setType] = useState(null);
    const [adminName, setAdminName] = useState('');
    const [inventoryCategoryId, setInventoryCategoryId] = useState(null);
    const [inventoryCategory, setInventoryCategory] = useState("")
    const [partNumber, setPartNumber] = useState('');

    const [inventoryCategories, setInventoryCategories] = useState([]);

    const [getInventoryCategoryByName] = useLazyQuery(getInventoryCategoriesByName, {
        onCompleted: data => {
            setInventoryCategories(data.inventory_categories)
        },
        onError: error => {
            console.log(error.message)
        }
    })

    const [addInventory] = useMutation(ADD_INVENTORY, {
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)

                if (data.inventory_create_inventory.success == true) {
                    toast.success("Inventory is successfully added.")
                    navigate(`/inventory-categories/inventories/${id}`)
                } else toast.error(data.inventory_create_inventory.message)
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    // Error states for the form fields
    const [errors, setErrors] = useState({
        id: '',
        unitsOnRequest: '',
        createdAt: '',
        updatedAt: '',
        scitControlNumber: '',
        supplier: '',
        country: '',
        address: '',
        contactNumber: '',
        emailAddress: '',
        website: '',
        unitPrice: '',
        quantity: '',
        totalAmount: '',
        datePurchaseReceived: '',
        dateRelease: '',
        totalUnitRelease: '',
        deliveredToClient: '',
        deliveryReceiptNo: '',
        unitReturn: '',
        locationStock: '',
        dateReturn: '',
        stockOffice: '',
        totalStockAmount: '',
        serialNumberStart: '',
        serialNumberEnd: '',
        isReturn: '',
        type: '',
        adminName: '',
        inventoryCategoryId: '',
        partNumber: ''
    });

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (unitPrice < 0 || !unitPrice) newErrors.unitPrice = 'Unit price cannot be negative';
        if (quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
        if (!serialNumberStart) newErrors.serialNumberStart = 'Serial number is required';

        // Add more validation logic for other fields as needed

        setErrors(newErrors);

        // Return whether the form is valid
        return Object.keys(newErrors).length === 0;
    };

    const onInventoryCategoryChange = (query) => {
        getInventoryCategoryByName({
            variables: {device: `${query}%`}
        })
    }

    const handleSubmit = () => {
        if(validateForm() === false) {
            setLoading(true)
            const variables = {
                supplier: supplier,
                country: country,
                address: address,
                contact_number: contactNumber,
                email_address: emailAddress,
                website: website,
                unit_price: unitPrice,
                quantity: quantity,
                total_amount: totalAmount,
                date_purchase_received: datePurchaseReceived,
                date_release: dateRelease,
                total_unit_release: totalUnitRelease,
                delivered_to_client: deliveredToClient,
                delivery_receipt_no: deliveryReceiptNo,
                unit_return: unitReturn,
                location_stock: locationStock,
                date_return: dateReturn,
                stock_office: stockOffice,
                serial_number_start: serialNumberStart,
                serial_number_end: serialNumberEnd,
                is_return: isReturn,
                type:type,
                inventory_category_id: id,
                part_number: partNumber,
                total_stock_amount: totalStockAmount
            };
            console.log(`add: ${variables}`)
            addInventory({
                variables: variables
            })
        }
    }

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Add inventory"} category={"Pages"}/>
            <Link
                to={`/inventory-categories/inventories/${id}`}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{background: currentColor}}
            >
                Back
            </Link>
            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">

                    {/* Field for Supplier */}
                    <InputWithError
                        className="min-w-full"
                        title="Supplier"
                        placeholder="Enter Supplier"
                        value={supplier}
                        onChange={(value) => setSupplier(value.target.value)}
                        error={errors.supplier}
                    />

                    {/* Field for Country */}
                    <InputWithError
                        className="min-w-full"
                        title="Country"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(value) => setCountry(value.target.value)}
                        error={errors.country}
                    />

                    {/* Field for Address */}
                    <InputWithError
                        className="min-w-full"
                        title="Address"
                        placeholder="Enter Address"
                        value={address}
                        onChange={(value) => setAddress(value.target.value)}
                        error={errors.address}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Part Number"
                        placeholder="Enter Part Number"
                        value={partNumber}
                        onChange={(value) => setPartNumber(value.target.value)}
                    />

                    {/* Field for Contact Number */}
                    <InputWithError
                        className="min-w-full"
                        title="Contact Number"
                        placeholder="Enter Contact Number"
                        value={contactNumber}
                        onChange={(value) => setContactNumber(value.target.value)}
                        error={errors.contactNumber}
                    />

                    {/* Field for Email Address */}
                    <InputWithError
                        className="min-w-full"
                        title="Email Address"
                        placeholder="Enter Email Address"
                        value={emailAddress}
                        onChange={(value) => setEmailAddress(value.target.value)}
                        error={errors.emailAddress}
                    />

                    {/* Field for Website */}
                    <InputWithError
                        className="min-w-full"
                        title="Website"
                        placeholder="Enter Website"
                        value={website}
                        onChange={(value) => setWebsite(value.target.value)}
                        error={errors.website}
                    />

                    {/* Field for Unit Price */}
                    <InputWithError
                        className="min-w-full"
                        title="Unit Price *"
                        placeholder="Enter Unit Price"
                        value={unitPrice}
                        onChange={(value) => setUnitPrice(value.target.value)}
                        error={errors.unitPrice}
                    />

                    {/* Field for Quantity */}
                    <InputWithError
                        className="min-w-full"
                        title="Quantity *"
                        placeholder="Enter Quantity"
                        value={quantity}
                        onChange={(value) => setQuantity(value.target.value)}
                        error={errors.quantity}
                    />

                    {/* Field for Total Amount */}
                    <InputWithError
                        className="min-w-full"
                        title="Total Amount"
                        placeholder="Enter Total Amount"
                        value={totalAmount}
                        onChange={(value) => setTotalAmount(value.target.value)}
                        error={errors.totalAmount}
                    />

                    <InputButton
                        className="min-w-full"
                        title="Date Purchase Received Date"
                        buttonTitle={datePurchaseReceived || 'Select Purchase Received Date'}
                        onClick={(date) => setDatePurchaseReceived(date)}
                        error={errors.datePurchaseReceived}
                    />

                    <InputButton
                        className="min-w-full"
                        title="Release Date"
                        buttonTitle={datePurchaseReceived || 'Select Release Date'}
                        onClick={(date) => setDateRelease(date)}
                        error={errors.dateRelease}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Total Unit Release *"
                        placeholder="Enter Total Unit Release"
                        value={totalUnitRelease}
                        onChange={(value) => setTotalUnitRelease(value.target.value)}
                        error={errors.totalUnitRelease}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Delivered To Client"
                        placeholder="Enter Delivered to client"
                        value={deliveredToClient}
                        onChange={(value) => setDeliveredToClient(value.target.value)}
                        error={errors.deliveredToClient}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Delivery Receipt No"
                        placeholder="Enter Delivery Receipt No"
                        value={deliveryReceiptNo}
                        onChange={(value) => setDeliveryReceiptNo(value.target.value)}
                        error={errors.deliveryReceiptNo}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Return Units"
                        placeholder="Enter Return Units"
                        value={unitReturn}
                        onChange={(value) => setUnitReturn(value.target.value)}
                        error={errors.unitReturn}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Location Stock"
                        placeholder="Enter location"
                        value={locationStock}
                        onChange={(value) => setLocationStock(value.target.value)}
                        error={errors.locationStock}
                    />

                    <InputButton
                        className="min-w-full"
                        title="Return Date"
                        buttonTitle={dateReturn || 'Select Return Date'}
                        onClick={(date) => setDateReturn(date)}
                        error={errors.dateReturn}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Stock Office"
                        placeholder="Enter stock office"
                        value={stockOffice}
                        onChange={(value) => setStockOffice(value.target.value)}
                        error={errors.stockOffice}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Total Stock Amount"
                        placeholder="Enter total stock amount"
                        value={totalStockAmount}
                        onChange={(value) => setTotalStockAmount(value.target.value)}
                        error={errors.totalStockAmount}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Start Serial Number *"
                        placeholder="Enter start serial number"
                        value={serialNumberStart}
                        onChange={(value) => setSerialNumberStart(value.target.value)}
                        error={errors.serialNumberStart}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="End Serial Number"
                        placeholder="Enter end serial number"
                        value={serialNumberEnd}
                        onChange={(value) => setSerialNumberEnd(value.target.value)}
                        error={errors.serialNumberEnd}
                    />

                    {/*<InputWithError
                        className="min-w-full"
                        title="Type"
                        placeholder="Enter type"
                        value={type}
                        onChange={(value) => setType(value.target.value)}
                        error={errors.type}
                    />*/}

                    <AppDropdown
                        title={"Title"}
                        value={type}
                        options={InventoriesStatusValues}
                        onSelected={(value) => setType(value)}
                        />

                    <AppCheckBox
                        value={isReturn}
                        title={"Is Return *"}
                        onChange={() => setIsReturn(!isReturn)}
                    />

                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff"/>
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddInventory;