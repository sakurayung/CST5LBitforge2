import { useState, useRef } from 'react';

import axiosClient from '../../axiosClient';

import itemwrap from './adminCreateItems.module.scss';

export default function AdminCreateItems(){
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    warehouse: 'Ma-a, Davao City',
    stocks: '',
    tags: '',
    processor_brand: '',
    processor_model: '',
    processor_cores: '',
    processor_threads: '',
    processor_base_clock: '',
    processor_boost_clock: '',
    gpu_brand: '',
    gpu_model: '',
    gpu_vram: '',
    gpu_clock_speed: '',
    ram_type: '',
    ram_capacity: '',
    ram_speed: '',
    storage_type: '',
    storage_capacity: '',
    motherboard_chipset: '',
    motherboard_form_factor: '',
    motherboard_socket: '',
    display_size: '',
    display_resolution: '',
    display_panel_type: '',
    display_refresh_rate: '',
    keyboard_type: '',
    keyboard_backlit: '',
    mouse_type: '',
    mouse_dpi: '',
    microphone_type: '',
    microphone_pattern: '',
    headset_driver_size: '',
    ports: '',
    connectivity: '',
    operating_system: '',
    power_supply: '',
    cooling: '',
    dimensions: '',
    weight: ''
  });

  const [errors, setErrors] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
  
    // Clear previous errors
    setErrors(null);

    // Validate required fields
    const newErrors = {};
    if (!file) newErrors.image = ['An image is required'];
    if (!formData.item_name) newErrors.item_name = ['Item name is required'];
    if (!formData.price || isNaN(formData.price)) newErrors.price = ['Valid price is required'];
    if (!formData.warehouse) newErrors.warehouse = ['Warehouse is required'];
    if (!formData.stocks || !Number.isInteger(Number(formData.stocks))) newErrors.stocks = ['Valid stock quantity is required'];
    
    // Validate tags format if provided
    if (formData.tags && !/^([a-z0-9\-]+( [a-z0-9\-]+)*)(,([a-z0-9\-]+( [a-z0-9\-]+)*))*$/i.test(formData.tags)) {
      newErrors.tags = ['Tags must be comma-separated words with only letters and numbers'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = new FormData();
      
      // Append required fields
      data.append('image', file);
      data.append('item_name', formData.item_name);
      data.append('price', formData.price);
      data.append('warehouse', formData.warehouse);
      data.append('stocks', formData.stocks);
      
      // Append optional fields if they have values
      const optionalFields = [
        'tags',
        'processor_brand', 'processor_model', 'processor_cores', 'processor_threads', 
        'processor_base_clock', 'processor_boost_clock',
        'gpu_brand', 'gpu_model', 'gpu_vram', 'gpu_clock_speed',
        'ram_type', 'ram_capacity', 'ram_speed',
        'storage_type', 'storage_capacity',
        'motherboard_chipset', 'motherboard_form_factor', 'motherboard_socket',
        'display_size', 'display_resolution', 'display_panel_type', 'display_refresh_rate',
        'keyboard_type', 'keyboard_backlit',
        'mouse_type', 'mouse_dpi',
        'microphone_type', 'microphone_pattern',
        'headset_driver_size',
        'ports', 'connectivity', 'operating_system',
        'power_supply', 'cooling', 'dimensions', 'weight',
        'battery_capacity', 'battery_life'
      ];

      optionalFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== '') {
          data.append(field, formData[field]);
        }
      });

      // Add debug logging
      console.log('FormData contents:');
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const res = await axiosClient.post('/items-create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      console.log('Item created successfully:', res.data);
      
      // Reset form after successful submission
      setFormData({
        item_name: '',
        price: '',
        warehouse: 'Ma-a, Davao City',
        stocks: '',
        tags: '',
        processor_brand: '',
        processor_model: '',
        processor_cores: '',
        processor_threads: '',
        processor_base_clock: '',
        processor_boost_clock: '',
        gpu_brand: '',
        gpu_model: '',
        gpu_vram: '',
        gpu_clock_speed: '',
        ram_type: '',
        ram_capacity: '',
        ram_speed: '',
        storage_type: '',
        storage_capacity: '',
        motherboard_chipset: '',
        motherboard_form_factor: '',
        motherboard_socket: '',
        display_size: '',
        display_resolution: '',
        display_panel_type: '',
        display_refresh_rate: '',
        keyboard_type: '',
        keyboard_backlit: '',
        mouse_type: '',
        mouse_dpi: '',
        microphone_type: '',
        microphone_pattern: '',
        headset_driver_size: '',
        ports: '',
        connectivity: '',
        operating_system: '',
        power_supply: '',
        cooling: '',
        dimensions: '',
        weight: ''
      });
      setFile(null);
      setErrors(null);
      alert('Item created successfully!');
      
      // Optional: Show success message or redirect
      
    } catch (err) {
      setFormData({
        item_name: '',
        price: '',
        warehouse: 'Ma-a, Davao City',
        stocks: '',
        tags: '',
        processor_brand: '',
        processor_model: '',
        processor_cores: '',
        processor_threads: '',
        processor_base_clock: '',
        processor_boost_clock: '',
        gpu_brand: '',
        gpu_model: '',
        gpu_vram: '',
        gpu_clock_speed: '',
        ram_type: '',
        ram_capacity: '',
        ram_speed: '',
        storage_type: '',
        storage_capacity: '',
        motherboard_chipset: '',
        motherboard_form_factor: '',
        motherboard_socket: '',
        display_size: '',
        display_resolution: '',
        display_panel_type: '',
        display_refresh_rate: '',
        keyboard_type: '',
        keyboard_backlit: '',
        mouse_type: '',
        mouse_dpi: '',
        microphone_type: '',
        microphone_pattern: '',
        headset_driver_size: '',
        ports: '',
        connectivity: '',
        operating_system: '',
        power_supply: '',
        cooling: '',
        dimensions: '',
        weight: ''
      });
      setFile(null);
      console.error('Error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      }
      if (err.response?.status === 422) {
        console.log('Validation errors:', err.response.data.errors);
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        // Handle logout or redirect
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
   <div className={itemwrap.itemwrap}>
      <div>
        <form onSubmit={handleSubmit}>
          <div className={itemwrap.top}>
            <div className={itemwrap.left}>
              <div className={itemwrap.imagewrap}>
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                {file ? (
                  <div className={itemwrap.previewimage} onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  </div>
                ) : (
                  <button type="button" onClick={handleClick} className={itemwrap.selectimageButton}>
                    Select File
                  </button>
                )}
                {errors?.image && <div className={itemwrap.error}>{errors.image[0]}</div>}
              </div>
            </div>
            <div className={itemwrap.right}>
              <table>
                <tbody>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Item Name: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div>
                          <input 
                            type="text" 
                            name="item_name" 
                            value={formData.item_name}
                            onChange={handleChange}
                            required
                          />
                          {errors?.item_name && <div className={itemwrap.error}>{errors.item_name[0]}</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Price: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div>
                          <input 
                            type="number" 
                            name="price" 
                            value={formData.price}
                            onChange={handleChange}
                            required
                          />
                          {errors?.price && <div className={itemwrap.error}>{errors.price[0]}</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Warehouse: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div>
                          <input 
                            type="text" 
                            name="warehouse" 
                            value={formData.warehouse}
                            onChange={handleChange}
                            required
                          />
                          {errors?.warehouse && <div className={itemwrap.error}>{errors.warehouse[0]}</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Stocks: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div>
                          <input 
                            type="number" 
                            name="stocks" 
                            value={formData.stocks}
                            onChange={handleChange}
                            required
                          />
                          {errors?.stocks && <div className={itemwrap.error}>{errors.stocks[0]}</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Tags: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div>
                          <textarea
                            name="tags"
                            value={formData.tags}
                            onChange={(e) => {
                              handleChange(e);
                              handleTextareaInput(e);
                            }}
                            placeholder='Gaming_Desktop, PC, Laptop, etc.'
                          />
                        </div>  
                      </div>
                    </td>
                  </tr>  
                </tbody>
              </table>
            </div>
          </div>  
          <div className={itemwrap.buttom}>
            <table>
              <tbody>
                {/* Processor */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Processor</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Brand: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_brand" 
                      value={formData.processor_brand} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Model: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_model" 
                      value={formData.processor_model} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Cores: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_cores" 
                      value={formData.processor_cores} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Threads: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_threads" 
                      value={formData.processor_threads} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Base Clock: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_base_clock" 
                      value={formData.processor_base_clock} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Boost Clock: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="processor_boost_clock" 
                      value={formData.processor_boost_clock} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Graphics Card */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Graphics Card</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Brand: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="gpu_brand" 
                      value={formData.gpu_brand} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Model: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="gpu_model" 
                      value={formData.gpu_model} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>VRAM: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="gpu_vram" 
                      value={formData.gpu_vram} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Clock Speed: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="gpu_clock_speed" 
                      value={formData.gpu_clock_speed} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* RAM */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>RAM</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="ram_type"
                      value={formData.ram_type}
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Capacity: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="ram_capacity" 
                      value={formData.ram_capacity} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Speed: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="ram_speed" 
                      value={formData.ram_speed} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Storage */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Storage</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="storage_type" 
                      value={formData.storage_type} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Capacity: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="storage_capacity" 
                      value={formData.storage_capacity} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Motherboard */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Motherboard</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Chipset: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="motherboard_chipset" 
                      value={formData.motherboard_chipset} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Form Factor: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="motherboard_form_factor" 
                      value={formData.motherboard_form_factor} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Socket: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="motherboard_socket" 
                      value={formData.motherboard_socket} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Display */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Display</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Size: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="display_size" 
                      value={formData.display_size}
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Resolution: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="display_resolution" 
                      value={formData.display_resolution} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Panel Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="display_panel_type" 
                      value={formData.display_panel_type} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Refresh Rate: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="display_refresh_rate" 
                      value={formData.display_refresh_rate} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Keyboard */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Keyboard</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="keyboard_type" 
                      value={formData.keyboard_type} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Backlit: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="keyboard_backlit" 
                      value={formData.keyboard_backlit} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Mouse */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Mouse</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="mouse_type" 
                      value={formData.mouse_type} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>DPI: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="mouse_dpi" 
                      value={formData.mouse_dpi} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Microphone */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Microphone</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="microphone_type" 
                      value={formData.microphone_type} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Pattern: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="microphone_pattern" 
                      value={formData.microphone_pattern} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>

                {/* Headset */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}>
                    <div><h4>Headset</h4></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Driver Size: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div>
                      <input 
                      type="text" 
                      name="headset_driver_size" 
                      value={formData.headset_driver_size} 
                      onChange={handleChange}
                      />
                    </div></div>
                  </td>
                </tr>
                <tr>
                  <td><br /></td>
                  <td><br /></td>
                </tr>
                <tr className={itemwrap.specdetailsArray}>
                  <td className={itemwrap.label}><div><p>Ports:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <textarea
                          name="ports"
                          value={formData.ports}
                          onChange={(e) => {
                            handleChange(e);
                            handleTextareaInput(e);
                          }}
                          placeholder='USB, HDMI etc.'
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetailsArray}>
                  <td className={itemwrap.label}><div><p>Connectivity:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <textarea
                          name="connectivity"
                          value={formData.connectivity}
                          onChange={(e) => {
                            handleChange(e);
                            handleTextareaInput(e);
                          }}
                          placeholder='Wi-Fi, Bluetooth etc.'
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails} style={{ borderTop: '1px solid #000' }}>
                  <td className={itemwrap.label}><div><p>Operating System: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input 
                        type="text" 
                        name="operating_system" 
                        value={formData.operating_system} 
                        onChange={handleChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Power Supply: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input 
                        type="text" 
                        name="power_supply"
                        value={formData.power_supply}
                        onChange={handleChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Cooling: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input 
                        type="text" 
                        name="cooling"
                        value={formData.cooling}
                        onChange={handleChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Dimensions: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input 
                        type="text" 
                        name="dimensions" 
                        value={formData.dimensions} 
                        onChange={handleChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Weight: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input 
                        type="text" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div> 
          <div className={itemwrap.buttonwrap}>
            <button type="submit">Confirm</button>
          </div> 
        </form>
        
      </div>
      
    </div>
  )
}