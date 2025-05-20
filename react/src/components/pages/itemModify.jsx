import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';

import { useGlobalContext } from '../context/globalContextProvider';
import axiosClient from '../../axiosClient';

import itemwrap from './itemModify.module.scss';

export default function AdminItemModify(){
  const { user, item } = useGlobalContext();

  if (!user) {
    // Display a loading indicator while user data is being fetched
    return <div>Loading...</div>;
  }

  if (user.role !== "admin") {
    // Redirect to error page if the user does not have the 'user' role
    return <Navigate to='/' replace/>;
  }

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0){
      setFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click(); // simulate clicking the hidden input
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto'; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
  };

  async function handleSubmit (e){
    e.preventDefault();
    
    const formData = new FormData(e.target);
    formData.append('item_name', e.target.item_name.value ? e.target.item_name.value : item.item_name);
    formData.append('price', e.target.price.value ? e.target.price.value : item.price);
    formData.append('warehouse', e.target.warehouse.value ? e.target.warehouse.value : item.warehouse);
    formData.append('stocks', e.target.stocks.value ? e.target.stocks.value : item.stocks);
    const tagsValue = e.target.tags.value ? e.target.tags.value : item.tags.join(',');
    formData.append('tags', tagsValue);
    formData.append('processor_brand', e.target.processor_brand.value ? e.target.processor_brand.value : item.specs.processor.brand);
    formData.append('processor_model', e.target.processor_model.value ? e.target.processor_model.value : item.specs.processor.model);
    formData.append('processor_cores', e.target.processor_cores.value ? e.target.processor_cores.value : item.specs.processor.cores);
    formData.append('processor_threads', e.target.processor_threads.value ? e.target.processor_threads.value : item.specs.processor.threads);
    formData.append('processor_base_clock', e.target.processor_base_clock.value ? e.target.processor_base_clock.value : item.specs.processor.base_clock);
    formData.append('processor_boost_clock', e.target.processor_boost_clock.value ? e.target.processor_boost_clock.value : item.specs.processor.boost_clock);
    formData.append('gpu_brand', e.target.gpu_brand.value ? e.target.gpu_brand.value : item.specs.graphics_card.brand);
    formData.append('gpu_model', e.target.gpu_model.value ? e.target.gpu_model.value : item.specs.graphics_card.model);
    formData.append('gpu_vram', e.target.gpu_vram.value ? e.target.gpu_vram.value : item.specs.graphics_card.vram);
    formData.append('gpu_clock_speed', e.target.gpu_clock_speed.value ? e.target.gpu_clock_speed.value : item.specs.graphics_card.clock_speed);
    formData.append('ram_type', e.target.ram_type.value ? e.target.ram_type.value : item.specs.ram.type);
    formData.append('ram_capacity', e.target.ram_capacity.value ? e.target.ram_capacity.value : item.specs.ram.capacity);
    formData.append('ram_speed', e.target.ram_speed.value ? e.target.ram_speed.value : item.specs.ram.speed);
    formData.append('storage_type', e.target.storage_type.value ? e.target.storage_type.value : item.specs.storage.type);
    formData.append('storage_capacity', e.target.storage_capacity.value ? e.target.storage_capacity.value : item.specs.storage.capacity);
    formData.append('motherboard_chipset', e.target.motherboard_chipset.value ? e.target.motherboard_chipset.value : item.specs.motherboard.chipset);
    formData.append('motherboard_form_factor', e.target.motherboard_form_factor.value ? e.target.motherboard_form_factor.value : item.specs.motherboard.form_factor);
    formData.append('motherboard_socket', e.target.motherboard_socket.value ? e.target.motherboard_socket.value : item.specs.motherboard.socket);
    formData.append('display_size', e.target.display_size.value ? e.target.display_size.value : item.specs.display.size);
    formData.append('display_resolution', e.target.display_resolution.value ? e.target.display_resolution.value : item.specs.display.resolution);
    formData.append('display_panel_type', e.target.display_panel_type.value ? e.target.display_panel_type.value : item.specs.display.panel_type);
    formData.append('display_refresh_rate', e.target.display_refresh_rate.value ? e.target.display_refresh_rate.value : item.specs.display.refresh_rate);
    formData.append('battery_capacity', e.target.battery_capacity.value ? e.target.battery_capacity.value : item.specs.battery.capacity);
    formData.append('battery_life', e.target.battery_life.value ? e.target.battery_life.value : item.specs.battery.life);
    formData.append('keyboard_type', e.target.keyboard_type.value ? e.target.keyboard_type.value : item.specs.keyboard.type);
    formData.append('keyboard_backlit', e.target.keyboard_backlit.value ? e.target.keyboard_backlit.value : item.specs.keyboard.backlit);
    formData.append('mouse_type', e.target.mouse_type.value ? e.target.mouse_type.value : item.specs.mouse.type);
    formData.append('mouse_dpi', e.target.mouse_dpi.value ? e.target.mouse_dpi.value : item.specs.mouse.dpi);
    formData.append('microphone_type', e.target.microphone_type.value ? e.target.microphone_type.value : item.specs.microphone.type);
    formData.append('microphone_pattern', e.target.microphone_pattern.value ? e.target.microphone_pattern.value : item.specs.microphone.pattern);
    formData.append('headset_driver_size', e.target.headset_driver_size.value ? e.target.headset_driver_size.value : item.specs.headset.driver_size);
    formData.append('ports', e.target.ports.value ? e.target.ports.value : item.specs.ports);
    formData.append('connectivity', e.target.connectivity.value ? e.target.connectivity.value : item.specs.connectivity);
    
    // Add the file if it exists
    if (file) {
      formData.append('image', file);
    }

    try {
      formData.append('_method', 'PUT'); // 👈 Spoof the method

      const response = await axiosClient.post(`/items/${item.item_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      // Handle success
      console.log('Item updated:', response.data);
      alert('Item updated successfully!');
      Navigate('../')
      // You might want to update your context or show a success message
      
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className={itemwrap.itemwrap}>
      <div>
        <form action="" onSubmit={handleSubmit} encType="multipart/form-data">
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
                
                {/* If file selected, show image */}
                {file ? (
                  <div className={itemwrap.previewimage} onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <img
                      src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                      alt="Preview"
                    />
                  </div>
                ) : (
                  <div className={itemwrap.previewimage} onClick={handleClick} style={{ cursor: 'pointer' }}>
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${item?.image_url}`}
                      alt="Default"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={itemwrap.right}>
              <table>
                <tbody>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Item Name: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div><input type="text" name="item_name" id="" defaultValue={item.item_name} required/></div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Price: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div><input type="number" name="price" id="" defaultValue={item.price} required/></div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Warehouse: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div><input type="text" name="warehouse" id="" defaultValue={item.warehouse} required/></div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Stocks: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div><input type="text" name="stocks" id="" defaultValue={item.stocks} required/></div>
                      </div>
                    </td>
                  </tr>
                  <tr className={itemwrap.inputrowwrap}>
                    <td className={itemwrap.label}><div><p>Tags: </p></div></td>
                    <td className={itemwrap.inputwrap}>
                      <div>
                        <div> <textarea
                        name="tags"
                        defaultValue={item.tags?.join(",")}
                        onChange={(e) => {
                          handleTextareaInput(e);
                        }}
                        /></div>  
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
                  <td colSpan={2}><div><h4>Processor</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Brand:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_brand" defaultValue={item.specs.processor.brand || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Model:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_model" defaultValue={item.specs.processor.model || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Cores:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_cores" defaultValue={item.specs.processor.cores || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Threads:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_threads" defaultValue={item.specs.processor.threads || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Base Clock:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_base_clock" defaultValue={item.specs.processor.base_clock || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Boost Clock:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="processor_boost_clock" defaultValue={item.specs.processor.boost_clock || ""} /></div></div>
                  </td>
                </tr>

                {/* Graphics Card */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>Graphics Card</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Brand:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="gpu_brand" defaultValue={item.specs.graphics_card.brand || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Model:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="gpu_model" defaultValue={item.specs.graphics_card.model || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>VRAM:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="gpu_vram" defaultValue={item.specs.graphics_card.vram || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Clock Speed:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="gpu_clock_speed" defaultValue={item.specs.graphics_card.clock_speed || ""} /></div></div>
                  </td>
                </tr>

                {/* RAM */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>RAM</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="ram_type" defaultValue={item.specs.ram.type || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Capacity:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="ram_capacity" defaultValue={item.specs.ram.capacity || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Speed:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="ram_speed" defaultValue={item.specs.ram.speed || ""} /></div></div>
                  </td>
                </tr>

                {/* Storage */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>Storage</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Type:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="storage_type" defaultValue={item.specs.storage.type || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Capacity:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="storage_capacity" defaultValue={item.specs.storage.capacity || ""} /></div></div>
                  </td>
                </tr>

                {/* Motherboard */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>Motherboard</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Chipset:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="motherboard_chipset" defaultValue={item.specs.motherboard.chipset || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Form Factor:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="motherboard_form_factor" defaultValue={item.specs.motherboard.form_factor || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Socket:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="motherboard_socket" defaultValue={item.specs.motherboard.socket || ""} /></div></div>
                  </td>
                </tr>

                {/* Display */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>Display</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Size:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="display_size" defaultValue={item.specs.display.size || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Resolution:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="display_resolution" defaultValue={item.specs.display.resolution || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Panel Type:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="display_panel_type" defaultValue={item.specs.display.panel_type || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Refresh Rate:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="display_refresh_rate" defaultValue={item.specs.display.refresh_rate || ""} /></div></div>
                  </td>
                </tr>
                {/* battery */}
                <tr className={itemwrap.spectitle}>
                  <td colSpan={2}><div><h4>Battery</h4></div></td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Capacity:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="battery_capacity" defaultValue={item.specs.battery.capacity || ""} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Life:</p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="battery_life" defaultValue={item.specs.battery.life || ""} /></div></div>
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
                    <div><div><input type="text" name="keyboard_type" id="" defaultValue={item.specs.keyboard?.type} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Backlit: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="keyboard_backlit" id="" defaultValue={item.specs.keyboard?.backlit} /></div></div>
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
                    <div><div><input type="text" name="mouse_type" id="" defaultValue={item.specs.mouse?.type} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>DPI: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="mouse_dpi" id="" defaultValue={item.specs.mouse?.dpi} /></div></div>
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
                    <div><div><input type="text" name="microphone_type" id="" defaultValue={item.specs.microphone?.type} /></div></div>
                  </td>
                </tr>
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Pattern: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div><div><input type="text" name="microphone_pattern" id="" defaultValue={item.specs.microphone?.pattern} /></div></div>
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
                    <div><div><input type="text" name="headset_driver_size" id="" defaultValue={item.specs.headset?.driver_size} /></div></div>
                  </td>
                </tr>
                <tr>
                  <td><br /></td>
                  <td><br /></td>
                </tr>
                {/* Ports */}
                <tr className={itemwrap.specdetailsArray}>
                  <td className={itemwrap.label}>
                    <div><p>Ports:</p></div>
                  </td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <textarea
                          name="ports"
                          defaultValue={item.specs.ports?.join(", ")}
                          onChange={(e) => {
                            handleTextareaInput(e);
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Connectivity */}
                <tr className={itemwrap.specdetailsArray}>
                  <td className={itemwrap.label}>
                    <div><p>Connectivity:</p></div>
                  </td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <textarea
                          name="connectivity"
                          defaultValue={item.specs.connectivity?.join(", ")}
                          onChange={(e) => {
                            handleTextareaInput(e);
                          }}
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
                        <input type="text" name="operating_system" id="" defaultValue={item.specs?.operating_system}/>
                      </div>
                    </div>
                  </td>
                </tr>
                
                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Power Supply: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input type="text" name="power_supply" id="" defaultValue={item.specs?.power_supply}/>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Cooling: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input type="text" name="cooling" id="" defaultValue={item.specs?.cooling}/>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Dimensions: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input type="text" name="dimensions" id="" defaultValue={item.specs?.dimensions}/>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={itemwrap.specdetails}>
                  <td className={itemwrap.label}><div><p>Weight: </p></div></td>
                  <td className={itemwrap.inputwrap}>
                    <div>
                      <div>
                        <input type="text" name="weight"  id="" defaultValue={item.specs?.weight}/>
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div> 
          <div className={itemwrap.buttonwrap}>
            <button type='submit'>Confirm</button>
          </div> 
        </form>
        
      </div>
      
    </div>
  )
}