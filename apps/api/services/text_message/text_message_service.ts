import axios from "axios";

export const sendTextMessage = (mess: string, contact: string) => {
    axios.post('https://textbelt.com/text', {
      phone: contact,
      message: mess,
      key: '938113449037b129ba9966d882fa3de627c5a7b1HEm6hpQSEnEHKqztObgLzg3tn',
    }).then(response => {
      console.log(response.data);
    })
  }