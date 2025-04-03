import { useSelector } from  "react-redux"
import { bookingQueryActions } from '@/store/store'

export const CompanyCode = () => {
  const { companyCode } = useSelector(state => state.booking)
  return (
    <div className="px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
      <h4 className="text-15 fw-500 ls-2 lh-16">Company code</h4>
      <input
        className="text-15 text-light-1 ls-2 lh-16"
        placeholder="Enter company code"
        value={companyCode}
        onChange={(event) => {
          dispatch(
            bookingQueryActions.setBookingQuery({
              companyCode: event?.target?.value?.toUpperCase(),
            })
          );
        }}
      />
    </div>
  );
};
