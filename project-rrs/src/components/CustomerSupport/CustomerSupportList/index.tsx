import React, { useState } from 'react'
import CustomerSupportWrite from '../CustomerSupportWrite'
import { CustomerSupport } from '../../../types/customerSupport'

export default function CustomerSupportList() {
  const [ csList, setCsList ] = useState<Partial<CustomerSupport>>({
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportCategory: "",
    customerSupportCreateAt: new Date(),
    customerSupportStatus: 1
    
  })
  return <>
  <div>하하핳하하</div>
  <CustomerSupportWrite />
  </>
}

