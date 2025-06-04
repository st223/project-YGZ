export function OrdersTab() {
  const orders = [
    { id: 1, date: '15.05.2023', total: 25000, status: 'Доставлен' },
    { id: 2, date: '22.06.2023', total: 35000, status: 'В обработке' }
  ];

  return (
    <div className="orders-tab">
      {orders.length === 0 ? (
        <p>У вас пока нет заказов</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.total.toLocaleString()} ₽</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}