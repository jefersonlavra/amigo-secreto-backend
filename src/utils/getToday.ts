export const getToday = () => {
    return Intl.DateTimeFormat('pt-br').format(new Date);
};