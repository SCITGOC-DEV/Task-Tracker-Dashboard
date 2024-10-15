import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Header from "../../components/Header";
import {InputFieldWithSuggestion} from "../../components/TextFieldWithSuggestions";
import PageRoutes from "../../utils/PageRoutes";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
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

const AddInventory = () => {
    const {currentColor} = useStateContext();

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)
    const {role} = useAuth()

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
    const [type, setType] = useState('');
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
                toast.success("Inventory is successfully added.")
                navigate(PageRoutes.InventoryRecords)
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

        if (unitsOnRequest < 0) newErrors.unitsOnRequest = 'Units on request cannot be negative';
        if (!createdAt) newErrors.createdAt = 'Creation date is required';
        if (!scitControlNumber) newErrors.scitControlNumber = 'SCIT Control Number is required';
        if (!supplier) newErrors.supplier = 'Supplier is required';
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Address is required';
        if (!contactNumber || !/^\d+$/.test(contactNumber)) newErrors.contactNumber = 'Valid contact number is required';
        if (emailAddress && !/\S+@\S+\.\S+/.test(emailAddress)) newErrors.emailAddress = 'Valid email address is required';
        if (unitPrice < 0) newErrors.unitPrice = 'Unit price cannot be negative';
        if (quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
        if (totalAmount < 0) newErrors.totalAmount = 'Total amount cannot be negative';
        if (!unitPrice) newErrors.unitPrice = 'Unit price cannot be empty';
        if (!quantity) newErrors.quantity = 'Quantity cannot be empty';
        if (!totalAmount) newErrors.totalAmount = 'Total amount cannot be empty';
        if (!totalUnitRelease) newErrors.totalUnitRelease = 'Total units cannot be empty';
        if (!unitReturn) newErrors.unitReturn = 'Units cannot be empty';
        if (!stockOffice) newErrors.stockOffice = 'Stock office is required';
        if (!inventoryCategoryId) newErrors.inventoryCategoryId = 'Inventory Category Id is required';

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
                address:address,
                admin_name: role,
                country:country,
                contact_number: contactNumber,
                created_at: today,
                date_purchase_received: datePurchaseReceived,
                date_release: dateRelease,
                date_return: dateReturn,
                delivered_to_client: deliveredToClient,
                email_address: emailAddress,
                delivery_receipt_no: deliveryReceiptNo,
                inventory_category_id: inventoryCategoryId,
                is_return: isReturn,
                location_stock: locationStock,
                quantity: quantity,
                scit_control_number: scitControlNumber,
                serial_number_end: serialNumberEnd,
                serial_number_start: serialNumberStart,
                stock_office: stockOffice,
                supplier: supplier,
                total_amount: totalAmount,
                total_stock_amount: totalStockAmount,
                total_unit_release: totalUnitRelease,
                unit_price: unitPrice,
                type: type,
                unit_return: unitReturn,
                units_on_request: unitsOnRequest,
                updated_at: today,
                website: website,
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
                to={PageRoutes.InventoryRecords}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{background: currentColor}}
            >
                Back
            </Link>
            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">

                    {/* Field for Units on Request */}
                    <InputWithError
                        className="min-w-full"
                        title="Units on Request *"
                        placeholder="Enter Units on Request"
                        value={unitsOnRequest}
                        onChange={(value) => setUnitsOnRequest(value.target.value)}
                        error={errors.unitsOnRequest}
                    />

                    {/* Field for SCIT Control Number */}
                    <InputWithError
                        className="min-w-full"
                        title="SCIT Control Number"
                        placeholder="Enter SCIT Control Number"
                        value={scitControlNumber}
                        onChange={(value) => setScitControlNumber(value.target.value)}
                        error={errors.scitControlNumber}
                    />

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
                        title="Total Amount *"
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
                        title="Stock Office *"
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
                        title="Start Serial Number"
                        placeholder="Enter start serial number"
                        value={serialNumberStart}
                        onChange={(value) => setSerialNumberStart(value.target.value)}
                        error={errors.serialNumberStart}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Type"
                        placeholder="Enter type"
                        value={type}
                        onChange={(value) => setType(value.target.value)}
                        error={errors.type}
                    />

                    <InputWithError
                        className="min-w-full"
                        title="End Serial Number"
                        placeholder="Enter end serial number"
                        value={serialNumberEnd}
                        onChange={(value) => setSerialNumberEnd(value.target.value)}
                        error={errors.serialNumberEnd}
                    />

                    <InputFieldWithSuggestion
                        className="min-w-full"
                        title="Inventory Category Name"
                        placeholder="Select or Enter Inventory category name"
                        value={inventoryCategory}
                        onChange={(value) => {
                            const inventoryCategory = inventoryCategories.find(category => category.device == value)
                            console.log(inventoryCategory)
                            setInventoryCategoryId(inventoryCategory?.id)
                            setInventoryCategory(value)
                        }}
                        suggestions={inventoryCategories.map(category => category.device)}
                        onValueChange={onInventoryCategoryChange}
                        error={errors.inventoryCategoryId}
                    />

                    <AppCheckBox
                        value={isReturn}
                        title={"Is Return"}
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