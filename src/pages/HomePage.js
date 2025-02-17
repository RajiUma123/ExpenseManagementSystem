import React,{useState,useEffect} from "react";
import { Modal,Form,Input, Select, message, Table,DatePicker} from "antd";
import Layout from "./../components/Layout/Layout";
import axios from 'axios'
import Spinner from '../components/Spinner'
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'
import Analytics from "../components/Layout/Analytics";
const {RangePicker} = DatePicker

const HomePage = () => {
   const [showModel , setshowModel]= useState(false)
   const [loading , setLoading] = useState(false)
   const [getTransaction,setgetTransaction]= useState([])
   const [frequency,setFrequency]= useState('7')
   const[selecteDate, setSelectedDate] = useState([])
   const[type, setType] = useState('all')
   const[ViewData, setViewData] = useState('table')
   const[edit, setedit] = useState(null)
   const [form] = Form.useForm(); // Create form instance


 
    const column =[
      {
        title:'Date',
        dataIndex:'date'
      },
      {
        title:'Amount',
        dataIndex:'amount'
      },
      {
        title:'Type',
        dataIndex:'type'
      },
      {
        title:'Category',
        dataIndex:'category'
      },
      {
        title:'Refrence',
        dataIndex:'refrence'
      },
      {
        title:'Description',
        dataIndex:'description'
      },
      {
        title:'Actions',
        render : (text,record)=>(
           <div> 
            <EditOutlined onClick={()=>{
              setedit(record)
              setshowModel(true)
            }}/>
            <DeleteOutlined className="mx-2" onClick={()=>{
              handledelete(record)
            }}/>
            </div>
        )
      }
    ]




    
      const getAllTransaction = async()=>{
        try {
         const user = JSON.parse(localStorage.getItem('user'))
         setLoading(true)
         const getres = await axios.post('/transactions/get-transaction',
           {
             userid:user._id,
             frequency,
             selecteDate,
             type
           })
         setLoading(false)
         setgetTransaction(getres.data)
         console.log(getres.data)
   
       } catch (error) {
           message.error("failed to fetch data")
       }
   
        }
   
        useEffect(() => {
          getAllTransaction();
        }, [frequency, selecteDate, type]);
  

   const handleSubmit = async(values)=>{
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        if(edit){
          await axios.post('/transactions/edit-transaction',{
            payload: {...values,
              userid:user._id
            },
            transactionId: edit._id
            }
           )
          setLoading(false)
          message.success("Transaction Updated Successfully")
        } else{
          await axios.post('/transactions/add-transaction',
            {...values,userid:user._id})
        setLoading(false)
        message.success("Transaction Added Successfully")
        }
        setshowModel(false)
        setedit(null)
        form.resetFields(); 
       getAllTransaction()
      } catch (error) {
        setLoading(false)
        message.error("Failed to add Transaction")
      }
   }


   const handledelete = async(record)=>{
    try {
      setLoading(true)
        await axios.post('/transactions/delete-transaction',
        {transactionId:record._id})
        setLoading(false)
          message.success("Transaction deleted Successfully")
          getAllTransaction();
    } catch (error) {
      setLoading(false)
      message.error("Failed to delete")
    }

   }

   const handleOpenModal = () => {
    setedit(null); // Ensure edit state is null when adding a new transaction
    form.resetFields(); // Reset form fields when opening the modal for new entry
    setshowModel(true);
  }
    
  return (
    <Layout>
      {loading&& <Spinner/>}
      <div className="m-4 filters">
      <div>
        <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values)=>setFrequency(values)}>
           <Select.Option value='7'>LAST 1ST WEEK</Select.Option>
           <Select.Option value='30'>LAST 1 MONTH</Select.Option>
           <Select.Option value ='365'>LAST 1 YEAR</Select.Option>
           <Select.Option value='custome'>CUSTOM</Select.Option>
          </Select>
          {frequency === 'custome' && <RangePicker value={selecteDate} onChange={(values)=>setSelectedDate(values)}/>}
       </div>
      <div>
       <h6>Select Type</h6>
          <Select value={type} onChange={(values)=>setType(values)}>
           <Select.Option value='all'>All</Select.Option>
           <Select.Option value='income'>Income</Select.Option>
           <Select.Option value ='expense'>Expense</Select.Option>
          </Select>
      </div>
      <div className="switch-icon mx-2"
     >
        <UnorderedListOutlined className={`mx-2 ${ViewData === 'table'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData('table')}/>
        <AreaChartOutlined  className={`mx-2 ${ViewData === 'analytics'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData('analytics')}/>
      
      </div>

      <div>
        <button className="switch-icon" onClick={()=>
          setshowModel(true)
        }>ADD</button>
      </div>
      </div>
      <div className="content">
        {ViewData=='table'? <Table columns={column} dataSource={getTransaction}/>
        : <Analytics getAllTransaction={getTransaction}/>}
         
      </div>
       <Modal title ={edit ? 'Edit Transaction':'Add Transaction'}
      onCancel={()=>setshowModel(false)}
      open={showModel}
      footer={false}
      >
       <Form layout="vertical" onFinish={handleSubmit} initialValues={edit} >
        <Form.Item label="Amount" name="amount">
         <Input type="text"/>
        </Form.Item>
        <Form.Item label="Type" name="type">
        <Select>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value='expense'>Expense</Select.Option>
        </Select>
        </Form.Item>
        <Form.Item label="Category" name="category">
        <Select>
          <Select.Option value="salary">Salary</Select.Option>
          <Select.Option value='tip'>Tip</Select.Option>
          <Select.Option value="project">Project</Select.Option>
          <Select.Option value='food'>Food</Select.Option>
          <Select.Option value="movie">Movie</Select.Option>
          <Select.Option value='bills'>Bills</Select.Option>
          <Select.Option value="medical">Medical</Select.Option>
          <Select.Option value='fees'>Fees</Select.Option>
        </Select>
        </Form.Item>
        <Form.Item className="" label="Date" name="date">
         <Input type="date"/>
        </Form.Item>
        <Form.Item label="Refrence" name="refrence">
         <Input type="text"/>
        </Form.Item>
        <Form.Item label="Description" name="description">
         <Input type="text"/>
        </Form.Item>
         <div className="d-flex justify-content-end">
         <button type ='submit' className='btn btn-primary'>
          {" "}
          SAVE
          </button>
         </div>
       </Form>
       </Modal>
      
    </Layout>
  );
};

export default HomePage;
