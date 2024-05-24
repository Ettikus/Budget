import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './App.css';

const BudgetApp = () => {
  const [budgetName, setBudgetName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCategoryAmountChange = (categoryIndex, event) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].amount = event.target.value;
    setCategories(updatedCategories);
  };

  const handleSubcategoryAmountChange = (categoryIndex, subIndex, event) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subIndex].amount = event.target.value;
    setCategories(updatedCategories);
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handlePaidChange = (categoryIndex, subIndex = null) => {
    const updatedCategories = [...categories];
    if (subIndex === null) {
      updatedCategories[categoryIndex].paid = !updatedCategories[categoryIndex].paid;
    } else {
      updatedCategories[categoryIndex].subcategories[subIndex].paid = !updatedCategories[categoryIndex].subcategories[subIndex].paid;
    }
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    if (newCategoryName.trim() !== '') {
      setCategories([
        ...categories,
        {
          name: newCategoryName,
          paid: false,
          subcategories: [],
        },
      ]);
      setNewCategoryName('');
    }
  };

  const addSubcategory = (categoryIndex) => {
    if (newSubcategoryName.trim() !== '' && newSubcategoryAmount.trim() !== '') {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].subcategories.push({
        name: newSubcategoryName,
        amount: newSubcategoryAmount,
        paid: false,
      });
      setCategories(updatedCategories);
      setNewSubcategoryName('');
      setNewSubcategoryAmount('');
    }
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };

  const handleDeleteSubcategory = (categoryIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories.splice(subIndex, 1);
    setCategories(updatedCategories);
  };

  const toggleCategory = (index) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateTotal = () => {
    let totalBudget = 0;
    const categoryTotals = categories.map((category) => {
      let categoryTotal = category.subcategories.reduce((acc, subcategory) => {
        return acc + (parseFloat(subcategory.amount) || 0);
      }, 0);
      totalBudget += categoryTotal;
      return categoryTotal;
    });
    return { totalBudget, categoryTotals };
  };

  return (
    <div className="budget-app">
      <div ref={componentRef}>
        <h1>My Budget App</h1>
        <label htmlFor="budgetNameInput">Budget Name:</label>
        <input
          type="text"
          id="budgetNameInput"
          value={budgetName}
          onChange={(e) => setBudgetName(e.target.value)}
          placeholder="Enter budget name"
        />
        <label htmlFor="currencySelect">Currency:</label>
        <select id="currencySelect" onChange={handleCurrencyChange} value={selectedCurrency}>
          {['USD', 'GBP', 'EUR', 'ZAR'].map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <div className="categories">
          <h2>Categories</h2>
          <div>
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-header" onClick={() => toggleCategory(index)}>
                  <h3>
                    {category.name}
                    <span className="toggle-icon">
                      {expandedCategories[index] ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(index);
                      }}
                    >
                      Delete
                    </button>
                  </h3>
                  {expandedCategories[index] && (
                    <>
                      <label>
                        Paid
                        <input
                          type="checkbox"
                          checked={category.paid || false}
                          onChange={() => handlePaidChange(index)}
                        />
                      </label>
                    </>
                  )}
                </div>
                {expandedCategories[index] && (
                  <>
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div key={subIndex} className="subcategory-item">
                        <span>{subcategory.name}</span>
                        <input
                          type="number"
                          value={subcategory.amount}
                          onChange={(e) => handleSubcategoryAmountChange(index, subIndex, e)}
                        />
                        <label>
                          Paid
                          <input
                            type="checkbox"
                            checked={subcategory.paid || false}
                            onChange={() => handlePaidChange(index, subIndex)}
                          />
                        </label>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteSubcategory(index, subIndex)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <div>
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Enter subcategory name"
                      />
                      <input
                        type="number"
                        value={newSubcategoryAmount}
                        onChange={(e) => setNewSubcategoryAmount(e.target.value)}
                        placeholder="Enter subcategory amount"
                      />
                      <button onClick={() => addSubcategory(index)}>Add Subcategory</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
            <button onClick={addCategory}>Add Category</button>
          </div>
        </div>
        <div className="total-budget">
          <h2>Total Budget</h2>
          <p>Total Budget: {calculateTotal().totalBudget} {selectedCurrency}</p>
          <div className="category-totals">
            
<h3>Category Totals</h3>
<ul>
  {categories.map((category, index) => (
    <li key={index}>
      {category.name}: {calculateTotal().categoryTotals[index]} {selectedCurrency}
    </li>
  ))}
</ul>
</div>
</div>
</div>
<button onClick={handlePrint}>Download PDF</button>
</div>
);
};

export default BudgetApp;
