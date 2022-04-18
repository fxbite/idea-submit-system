const moment = require('moment')
const {Folder, User} = require('../app/models')
const tz = require('moment-timezone')
const mongoose = require('mongoose')

const showData = (req, res, next) => {

    //? Role
    res.locals.role = req.session.role

    //? Show login name
    res.locals.userName = req.session.userName

    //? Show login userId
    res.locals.userLoginId = String(req.session.userId)

    //? Format time and timezone for submission
    res.locals.formatDateSubmission = (value, format = 'LLLL', tz = 'Asia/Ho_Chi_Minh') => {

        //? Check value is exist
        if(!value) {
            return ''
        }

        const data = moment(value);
        if (!data.isValid()) {
            return value;
        }

        if (tz) {
            data.tz(tz);
        }

        return data.format(format);
    }

    //? Format time and timezone for forum
    res.locals.formatDateForum = (value) => {

        moment.updateLocale('en', {
            relativeTime: {
               future: "in %s",
               past: "%s ago",
               s: 'a few seconds',
               ss: '%d seconds',
               m: "a minute",
               mm: "%d minutes",
               h: "an hour",
               hh: "%d hours",
               d: "a day",
               dd: "%d days",
               M: "a month",
               MM: "%d months",
               y: "a year",
               yy: "%d years"
            }
         });

        //? Check value is exist
        if(!value) {
            return ''
        }

        const data = moment(value);
        if (!data.isValid()) {
            return value;
        }

        return data.fromNow();
    }

    //? Pagination
    res.locals.pagination = (currentPage, totalPages, uri) => {
        current = Number(currentPage);
        pages = Number(totalPages);
    
        let html = '';
        if (pages > 0) {
          html += `
            <nav aria-label="Page navigation example">
              <ul class="pagination justify-content-end">    
          `;
    
          //? First Page
          if (current == 1) {
            html += `
              <li class="page-item disabled">
                <a class="page-link" href="#">First</a>
              </li>
            `;
          } else {
            html += `
              <li class="page-item">
                <a class="page-link" href="${uri}?page=1">First</a>
              </li>
            `;
          }
    
          //? Items Page
          let i = current > 4 ? current - 3 : 1;
          if (i !== 1) {
            html += `
              <li class="page-item disabled">
                <a class="page-link" href="#">...</a>
              </li>
            `;
          }
          for (i <= current + 3; i <= pages; i++) {
            if (i == current) {
              html += `
                <li class="page-item active">
                  <a class="page-link" href="${uri}?page=${i}">
                    ${i}
                  </a>
                </li>
              `;
            } else {
              html += `
                <li class="page-item">
                  <a class="page-link" href="${uri}?page=${i}">
                    ${i}
                  </a>
                </li>
              `;
            }
            if (i == current + 3 && i < pages) {
              html += `
                <li class="page-item disabled">
                  <a class="page-link" href="#">...</a>
                </li>
              `;
              break;
            }
          }
    
          //? Next Page
          if (current !== pages) {
            html += `
              <li class="page-item">
                <a class="page-link" href="${uri}?page=${current + 1}">
                    Next
                </a>
              </li>
            `;
          } else {
            html += `
              <li class="page-item disabled">
                <a class="page-link" href="${uri}?page=${pages}">
                    Next
                </a>
              </li>
            `;
          }
    
          //? Last Page
          if (current == pages) {
            html += `
              <li class="page-item disabled">
                <a class="page-link" href="#">Last</a>
              </li>
            `;
          } else {
            html += `
              <li class="page-item">
                <a class="page-link" href="${uri}?page=${pages}">
                    Last
                </a>
              </li>
            `;
          }
    
          html += `
              </ul>
            </nav>
          `;
        }
    
        return html;
      };
    

    next()
}

module.exports = showData