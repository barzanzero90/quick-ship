export function FormatMoney(money) {
  if (isNaN(money) || money == null) {
    return "0";
  }

  const moneyString = money.toString();

  return moneyString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
